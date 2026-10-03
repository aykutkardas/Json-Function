import {
  isArray,
  isObject,
  isFunction,
  isArrayOfObject,
} from "../../utils/type-check.js";
import getObjDeepProp from "../../utils/get-obj-deep-prop.js";
import WhereTool, { WhereToolObject } from "./tool/callback.js";

// Each field is compared with === unless its value is a predicate, such as
// the ones returned by the `wh` helpers.
export type WhereQuery = Record<string, any>;

export type WhereQueries =
  | WhereQuery
  | WhereQuery[]
  | ((wh: WhereToolObject) => WhereQuery | WhereQuery[]);

export type WhereOptions = {
  deep?: boolean;
};

type Predicate = (item: any) => boolean;

const EMPTY = {} as Record<string, any>;

const compileQuery = (query: WhereQuery, deep: boolean): Predicate => {
  const checks: Predicate[] = Object.keys(query).map((fieldName) => {
    const get = deep
      ? getObjDeepProp(fieldName)
      : (item: any) => (item || EMPTY)[fieldName];
    const expected = query[fieldName];

    if (isFunction(expected)) {
      return (item) => Boolean(expected(get(item)));
    }

    return (item) => get(item) === expected;
  });

  if (checks.length === 1) {
    return checks[0];
  }

  return (item) => {
    for (let i = 0; i < checks.length; i++) {
      if (!checks[i](item)) {
        return false;
      }
    }
    return true;
  };
};

// Turns the queries into a single predicate once, instead of re-reading the
// query objects for every item. Returns null when the queries are invalid.
export const compileWhere = (
  queries: WhereQueries,
  options?: WhereOptions
): Predicate | null => {
  let queriesArr: WhereQuery[];

  if (isFunction(queries)) {
    const result = queries(WhereTool);
    queriesArr = isArrayOfObject(result) ? result : [result];
  } else if (isObject(queries)) {
    queriesArr = [queries];
  } else if (isArrayOfObject(queries)) {
    queriesArr = queries;
  } else {
    return null;
  }

  const deep = Boolean(options && options.deep);
  const predicates = queriesArr.map((query) => compileQuery(query, deep));

  if (predicates.length === 1) {
    return predicates[0];
  }

  // Multiple queries are OR'ed: an item is kept once, in its original
  // position, if it matches any of them.
  return (item) => {
    for (let i = 0; i < predicates.length; i++) {
      if (predicates[i](item)) {
        return true;
      }
    }
    return false;
  };
};

function where<T>(data: T[], queries: WhereQueries, options?: WhereOptions): T[] {
  if (!isArray(data)) {
    return [];
  }

  const predicate = compileWhere(queries, options);

  return predicate ? data.filter(predicate) : data;
}

export default where;
