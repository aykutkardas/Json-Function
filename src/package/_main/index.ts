import {
  orderBy as OrderBy,
  where as Where,
  limit as Limit,
  select as Select,
  search as Search,
  schema as Schema,
  transform as Transform,
  innerJoin as InnerJoin,
  leftJoin as LeftJoin,
} from "..";

import { isArray, isObject } from "../../utils/type-check";

export type Step =
  | { type: "where"; args: [Object | Object[] | Function, Object?] }
  | { type: "search"; args: [any, string | string[], Object?] }
  | { type: "orderBy"; args: [string, string, Object?] }
  | { type: "limit"; args: [number, number] }
  | { type: "select"; args: [string | string[], Object?] }
  | { type: "schema"; args: [Object | Function] }
  | { type: "transform"; args: [] }
  | { type: "innerJoin"; args: [Object[], string, string] }
  | { type: "leftJoin"; args: [Object[], string, string] };

export type Query = Step[];

// Shape returned by getQuery() before 2.0. Still accepted by setQuery() and
// get(data, { query }); its steps run in this fixed key order.
type LegacyQuery = {
  orderBy?: [string, string, Object?];
  where?: [Object | Object[], Object?];
  limit?: number[];
  select?: string | string[];
  search?: [string, string | string[], Object?];
  schema?: Object;
  innerJoin?: [Object[], string, string];
};

type Config = {
  query?: Query | LegacyQuery;
};

const fromLegacyQuery = (query: LegacyQuery): Query => {
  const steps: Query = [];

  Object.keys(query).forEach((type) => {
    const value = query[type];

    if (!value) {
      return;
    }

    if (type === "select" || type === "schema") {
      steps.push(<Step>{ type, args: [value] });
    } else if (isArray(value)) {
      steps.push(<Step>{ type, args: [...value] });
    }
  });

  return steps;
};

const normalizeQuery = (query: Query | LegacyQuery): Query => {
  if (isArray(query)) {
    return [...(<Query>query)];
  }

  if (isObject(query)) {
    return fromLegacyQuery(<LegacyQuery>query);
  }

  return [];
};

const runStep = (data: Object[], step: Step): Object[] => {
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
      return <Object[]>Schema(data, step.args[0]);
    case "transform":
      return <Object[]>Transform(data);
    case "innerJoin":
      return InnerJoin(data, step.args[0], step.args[1], step.args[2]);
    case "leftJoin":
      return LeftJoin(data, step.args[0], step.args[1], step.args[2]);
    default:
      return data;
  }
};

// Every method returns a new instance, so a query that is built but never
// run cannot leak into another one, and partial queries can be reused:
//
//   const incomplete = JsonFunction.where({ completed: false });
//   incomplete.limit(2).get(data);
//   incomplete.orderBy("title").get(data);
export class JsonFunction {
  private readonly steps: Query;

  constructor(steps: Query = []) {
    this.steps = steps;
  }

  private add(step: Step) {
    return new JsonFunction([...this.steps, step]);
  }

  where(queries: Object | Object[] | Function, option?: Object) {
    return this.add({ type: "where", args: [queries, option] });
  }

  search(key: any, fields: string | string[], option?: Object) {
    return this.add({ type: "search", args: [key, fields, option] });
  }

  orderBy(fieldName: string, order: string = "ASC", option?: Object) {
    return this.add({ type: "orderBy", args: [fieldName, order, option] });
  }

  limit(limit: number = 10, start: number = 0) {
    return this.add({ type: "limit", args: [limit, start] });
  }

  select(fields: string | string[], option?: Object) {
    return this.add({ type: "select", args: [fields, option] });
  }

  schema(schema: Object | Function) {
    return this.add({ type: "schema", args: [schema] });
  }

  transform() {
    return this.add({ type: "transform", args: [] });
  }

  innerJoin(otherData: Object[], dataFieldName: string, otherFieldName: string) {
    return this.add({
      type: "innerJoin",
      args: [otherData, dataFieldName, otherFieldName],
    });
  }

  leftJoin(otherData: Object[], dataFieldName: string, otherFieldName: string) {
    return this.add({
      type: "leftJoin",
      args: [otherData, dataFieldName, otherFieldName],
    });
  }

  // Runs the steps in the order they were added.
  get(data: Object[], config: Config = {}) {
    const steps = config.query
      ? [...this.steps, ...normalizeQuery(config.query)]
      : this.steps;

    const result = steps.reduce(runStep, data);

    // Never hand the caller's own array back.
    return result === data ? [...data] : result;
  }

  getQuery(): Query {
    return this.steps.map((step) => <Step>{ type: step.type, args: [...step.args] });
  }

  // Returns a new instance that runs exactly the given query.
  setQuery(query: Query | LegacyQuery) {
    return new JsonFunction(normalizeQuery(query));
  }
}

export default new JsonFunction();
