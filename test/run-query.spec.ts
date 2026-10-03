import { describe, it, expect } from "vitest";
import { runQuery, runStep } from "../src/package/_main/run-query";
import type { Step } from "../src/package";

// runQuery fuses, reorders and short-circuits steps. Its result must always
// equal running the steps one by one with the standalone functions.
const reference = (data: any[], steps: Step[]) => steps.reduce(runStep, data);

let seed = 7;
const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const pick = <T>(items: T[]): T => items[Math.floor(random() * items.length)];
const int = (max: number) => Math.floor(random() * max);

const makeItem = (i: number) => {
  const item: any = {
    id: i,
    group: int(4),
    score: int(20),
    name: pick(["ann", "bob", "cem", "deniz", "Ece"]) + int(3),
    nested: { level: int(5), tag: pick(["x", "y", "z"]) },
  };
  if (random() < 0.15) delete item.score;
  if (random() < 0.1) item.mixed = pick([1, "1", null, true]);
  else item.mixed = int(5);
  if (random() < 0.1) delete item.nested;
  return item;
};

const others = Array.from({ length: 6 }, (_, i) => ({ group: i % 4, label: "g" + i }));

const randomStep = (): Step => {
  // Fixed when the step is created; the where callback must not draw new
  // random numbers each time it is called.
  const threshold = int(20);

  switch (int(8)) {
    case 0:
      return {
        type: "where",
        args: pick<any>([
          [{ group: int(4) }],
          [(wh: any) => ({ score: wh.gt(threshold) })],
          [[{ group: 1 }, { score: threshold }]],
          [{ "nested.tag": "x" }, { deep: true }],
          [{}],
        ]),
      };
    case 1:
      return {
        type: "search",
        args: pick<any>([
          ["an", "name"],
          ["E", ["name", "nested.tag"], { caseSensitive: false }],
          [3, ["score", "group"]],
        ]),
      };
    case 2:
      return {
        type: "orderBy",
        args: [
          pick(["score", "name", "mixed", "nested.level", "missing"]),
          pick(["ASC", "DESC", "desc"]),
          pick([undefined, { deep: true }]),
        ],
      };
    case 3:
    case 4:
      return {
        type: "limit",
        args: pick<any>([
          [int(10), 0],
          [int(10), int(10)],
          [0, 0],
          [3, 200],
          [-2, 0],
          [2.5, 1],
        ]),
      };
    case 5:
      return {
        type: "select",
        args: pick<any>([
          [["id", "score", "name", "group", "mixed"]],
          [["id", "nested.level", "score"], { deep: true }],
          ["id"],
        ]),
      };
    case 6:
      return { type: "schema", args: [{ id: "id", score: "score", g: "group", deepTag: "nested.tag" }] };
    default:
      return {
        type: pick(["innerJoin", "leftJoin"] as const),
        args: [others, "group", "group"],
      };
  }
};

describe("runQuery", () => {
  it("Gives the same result as running steps one by one (random chains).", () => {
    for (let run = 0; run < 3000; run++) {
      const data = Array.from({ length: int(60) }, (_, i) => makeItem(i));
      const steps = Array.from({ length: 1 + int(5) }, randomStep);
      const expected = reference(data, steps);
      const actual = runQuery(data, steps);
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        const describe = (step: any) => step.type + JSON.stringify(step.args, (k, v) => (typeof v === "function" ? String(v) : v));
        throw new Error(`run ${run}: ${steps.map(describe).join(" -> ")}
expected ${expected?.length} items, got ${actual?.length}`);
      }
    }
  });

  it("Uses top-k selection on large inputs with the same result.", () => {
    for (let run = 0; run < 200; run++) {
      const data = Array.from({ length: 200 + int(400) }, (_, i) => makeItem(i));
      const steps: Step[] = [
        { type: "orderBy", args: [pick(["score", "name", "nested.level", "mixed"]), pick(["ASC", "DESC"]), { deep: true }] },
        { type: "limit", args: [1 + int(20), int(5)] },
      ];
      expect(runQuery(data, steps)).to.deep.equal(reference(data, steps));
    }
  });

  it("Stops reading once a limit is full.", () => {
    let reads = 0;
    const data = Array.from({ length: 1000 }, (_, i) => ({
      get id() {
        reads++;
        return i;
      },
    }));
    runQuery(data, [
      { type: "where", args: [(wh: any) => ({ id: wh.gte(0) })] },
      { type: "limit", args: [5, 0] },
    ]);
    expect(reads).to.equal(5);
  });

  it("Handles non-array input like the standalone functions.", () => {
    const steps: Step[] = [{ type: "where", args: [{ a: 1 }] }];
    expect(runQuery(null as any, steps)).to.deep.equal([]);
  });
});
