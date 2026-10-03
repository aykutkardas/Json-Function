import {
  isArray,
  isObject,
  isFunction,
  isArrayOfObject,
} from "../../utils/type-check";
import getObjDeepProp from "../../utils/get-obj-deep-prop";
import WhereTool, { WhereToolObject } from "./tool/callback";

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

function where<T>(data: T[], queries: WhereQueries, options?: WhereOptions): T[] {
  if (!isArray(data)) {
    return [];
  }

  let queriesArr: WhereQuery[];

  if (isFunction(queries)) {
    const result = queries(WhereTool);
    queriesArr = isArrayOfObject(result) ? result : [result];
  } else if (isObject(queries)) {
    queriesArr = [queries];
  } else if (isArrayOfObject(queries)) {
    queriesArr = queries;
  } else {
    return data;
  }

  const matchesQuery = (item: any, query: WhereQuery) =>
    Object.keys(query).every((fieldName) => {
      let value = item[fieldName];
      const activeQuery = query[fieldName];

      if (options && options.deep) {
        value = getObjDeepProp(fieldName)(item);
      }

      if (isFunction(activeQuery)) {
        return Boolean(activeQuery(value));
      }

      return value === activeQuery;
    });

  // Multiple queries are OR'ed: an item is kept once, in its original
  // position, if it matches any of them.
  return data.filter((item) =>
    queriesArr.some((query) => matchesQuery(item, query))
  );
}

export default where;
