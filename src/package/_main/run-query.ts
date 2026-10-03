import Where, { compileWhere } from "../where/index.js";
import Search, { compileSearch } from "../search/index.js";
import OrderBy, { compileOrderBy, sortBySpec, topKBySpec, hasTotalOrder, SortSpec } from "../orderBy/index.js";
import Limit from "../limit/index.js";
import Select, { compileSelect } from "../select/index.js";
import Schema from "../schema/index.js";
import { innerJoin as InnerJoin, leftJoin as LeftJoin } from "../innerJoin/index.js";
import { isArray } from "../../utils/type-check.js";
import type { Step } from "./index.js";

// Runs one step on the whole array with the standalone function.
export const runStep = (data: object[], step: Step): object[] => {
  switch (step.type) {
    case "where":
      return Where(data, step.args[0], step.args[1]);
    case "search":
      return Search(data, step.args[0], step.args[1], step.args[2]);
    case "orderBy":
      return OrderBy(data, step.args[0], step.args[1], step.args[2]);
    case "limit":
      return Limit(data, step.args[0], step.args[1]);
    case "select":
      return Select(data, step.args[0], step.args[1]);
    case "schema":
      return Schema(data, step.args[0]);
    case "innerJoin":
      return InnerJoin(data, step.args[0], step.args[1], step.args[2]);
    case "leftJoin":
      return LeftJoin(data, step.args[0], step.args[1], step.args[2]);
    default:
      return data;
  }
};

// filter, map and limit work item by item and are fused into one pass.
// sort and barrier need the whole array.
type Op =
  | { kind: "filter"; test: (item: any) => boolean }
  | { kind: "map"; project: (item: any) => any }
  | { kind: "limit"; start: number; count: number }
  | { kind: "sort"; spec: SortSpec }
  | { kind: "barrier"; step: Step };

const isStreamable = (op: Op) =>
  op.kind === "filter" || op.kind === "map" || op.kind === "limit";

const toOp = (step: Step): Op | null => {
  switch (step.type) {
    case "where": {
      const test = compileWhere(step.args[0], step.args[1]);
      return test ? { kind: "filter", test } : null;
    }
    case "search": {
      const test = compileSearch(step.args[0], step.args[1], step.args[2]);
      return test ? { kind: "filter", test } : null;
    }
    case "select": {
      const project = compileSelect(step.args[0], step.args[1]);
      return project ? { kind: "map", project } : null;
    }
    case "orderBy": {
      const spec = compileOrderBy(step.args[0], step.args[1], step.args[2]);
      return spec ? { kind: "sort", spec } : null;
    }
    case "limit": {
      const [count, start] = step.args;
      // Negative or fractional values follow Array#slice rules, which only
      // the standalone limit() reproduces.
      if (Number.isInteger(count) && Number.isInteger(start) && count >= 0 && start >= 0) {
        return { kind: "limit", start, count };
      }
      return { kind: "barrier", step };
    }
    default:
      // schema and joins validate the whole array first, so they
      // keep running on it to give exactly the same results.
      return { kind: "barrier", step };
  }
};

// Moves a limit in front of the selects before it, so only kept items are
// mapped. This never changes the result because select maps one item to one
// item. "orderBy → select → limit" becomes "orderBy → limit → select", which
// lets the sort keep only the top items.
//
// Filters after a sort are handled at run time instead (see runQuery),
// because moving them is only safe for some sort keys.
const plan = (ops: Op[]): Op[] => {
  const planned = [...ops];
  let changed = true;

  while (changed) {
    changed = false;
    for (let i = 0; i < planned.length - 1; i++) {
      const [first, second] = [planned[i], planned[i + 1]];
      if (first.kind === "map" && second.kind === "limit") {
        planned[i] = second;
        planned[i + 1] = first;
        changed = true;
      }
    }
  }

  return planned;
};

// One pass over the data for a run of filter/map/limit ops. Stops reading
// as soon as a limit is full, since no later item can reach the output.
const runStream = (data: any[], ops: Op[]): any[] => {
  if (ops.length === 0) {
    return data;
  }

  const skipped = new Array<number>(ops.length).fill(0);
  const taken = new Array<number>(ops.length).fill(0);
  const result: any[] = [];

  for (let i = 0; i < data.length; i++) {
    let value = data[i];
    let keep = true;
    let full = false;

    for (let k = 0; k < ops.length; k++) {
      const op = ops[k];

      if (op.kind === "filter") {
        if (!op.test(value)) {
          keep = false;
          break;
        }
      } else if (op.kind === "map") {
        value = op.project(value);
      } else if (op.kind === "limit") {
        if (skipped[k] < op.start) {
          skipped[k]++;
          keep = false;
          break;
        }
        if (taken[k] >= op.count) {
          return result;
        }
        taken[k]++;
        if (taken[k] === op.count) {
          full = true;
        }
      }
    }

    if (keep) {
      result.push(value);
      if (full) {
        return result;
      }
    }
  }

  return result;
};

export const runQuery = (data: object[], steps: Step[]): object[] => {
  if (!isArray(data)) {
    return steps.reduce(runStep, data);
  }

  const ops = plan(steps.map(toOp).filter((op): op is Op => op !== null));

  let current: object[] = data;
  let stream: Op[] = [];

  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];

    if (isStreamable(op)) {
      stream.push(op);
      continue;
    }

    current = runStream(current, stream);
    stream = [];

    if (op.kind === "sort") {
      // Filters right after the sort can run first, so fewer items are
      // sorted. The sort is stable, so this keeps the same order as long as
      // the keys have a total order; otherwise they stay after the sort.
      let next = ops[i + 1];

      if (next && next.kind === "filter" && hasTotalOrder(current, op.spec)) {
        const filters: Op[] = [];
        while (next && next.kind === "filter") {
          filters.push(next);
          i++;
          next = ops[i + 1];
        }
        current = runStream(current, filters);
      }

      if (next && next.kind === "limit") {
        current = topKBySpec(current, op.spec, next.start + next.count).slice(next.start);
        i++;
      } else {
        current = sortBySpec(current, op.spec);
      }
    } else if (op.kind === "barrier") {
      current = runStep(current, op.step);
    }
  }

  return runStream(current, stream);
};
