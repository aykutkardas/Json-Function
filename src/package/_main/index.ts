import { runQuery } from "./run-query.js";
import { isArray, isObject, AnyObject } from "../../utils/type-check.js";
import type { WhereQueries, WhereOptions } from "../where/index.js";
import type { SearchOptions } from "../search/index.js";
import type { Order, OrderByOptions } from "../orderBy/index.js";
import type { SelectOptions } from "../select/index.js";
import type { SchemaInput } from "../schema/index.js";

export type Step =
  | { type: "where"; args: [WhereQueries, WhereOptions?] }
  | { type: "search"; args: [unknown, string | string[], SearchOptions?] }
  | { type: "orderBy"; args: [string, Order, OrderByOptions?] }
  | { type: "limit"; args: [number, number] }
  | { type: "select"; args: [string | string[], SelectOptions?] }
  | { type: "schema"; args: [SchemaInput] }
  | { type: "innerJoin"; args: [object[], string, string] }
  | { type: "leftJoin"; args: [object[], string, string] };

export type Query = Step[];

// Shape returned by getQuery() before 2.0. Still accepted by setQuery() and
// get(data, { query }); its steps run in this fixed key order.
export type LegacyQuery = {
  orderBy?: [string, Order, OrderByOptions?] | null;
  where?: [WhereQueries, WhereOptions?] | null;
  limit?: number[] | null;
  select?: string | string[] | null;
  search?: [string, string | string[], SearchOptions?] | null;
  schema?: SchemaInput | null;
  innerJoin?: [object[], string, string] | null;
};

type Config = {
  query?: Query | LegacyQuery;
};

const fromLegacyQuery = (query: LegacyQuery): Query => {
  const steps: Query = [];

  Object.keys(query).forEach((type) => {
    const value = (query as AnyObject)[type];

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

  where(queries: WhereQueries, option?: WhereOptions) {
    return this.add({ type: "where", args: [queries, option] });
  }

  search(key: unknown, fields: string | string[], option?: SearchOptions) {
    return this.add({ type: "search", args: [key, fields, option] });
  }

  orderBy(fieldName: string, order: Order = "ASC", option?: OrderByOptions) {
    return this.add({ type: "orderBy", args: [fieldName, order, option] });
  }

  limit(limit: number = 10, start: number = 0) {
    return this.add({ type: "limit", args: [limit, start] });
  }

  select(fields: string | string[], option?: SelectOptions) {
    return this.add({ type: "select", args: [fields, option] });
  }

  schema(schema: SchemaInput) {
    return this.add({ type: "schema", args: [schema] });
  }

  innerJoin(otherData: object[], dataFieldName: string, otherFieldName: string) {
    return this.add({
      type: "innerJoin",
      args: [otherData, dataFieldName, otherFieldName],
    });
  }

  leftJoin(otherData: object[], dataFieldName: string, otherFieldName: string) {
    return this.add({
      type: "leftJoin",
      args: [otherData, dataFieldName, otherFieldName],
    });
  }

  // Runs the steps in the order they were added. The result type is not
  // tracked through the chain; pass it as T if you know it.
  get<T = AnyObject>(data: object[], config: Config = {}): T[] {
    const steps = config.query
      ? [...this.steps, ...normalizeQuery(config.query)]
      : this.steps;

    const result = runQuery(data, steps);

    // Never hand the caller's own array back.
    return (result === data ? [...data] : result) as T[];
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
