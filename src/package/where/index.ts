import {
  isArray,
  isObject,
  isFunction,
  isArrayOfObject,
} from "../../utils/type-check";
import getObjDeepProp from "../../utils/get-obj-deep-prop";
import WhereTool from "./tool/callback";

type WhereItem = {
  [key: string]: any;
};

type WhereFunction = (
  data: WhereItem[],
  queries: Object | Object[] | Function,
  options?: {
    deep?: boolean;
  }
) => Object[];

const where: WhereFunction = (data, queries, options) => {
  if (!isArray(data)) {
    return [];
  }

  let queriesArr: Object[];

  if (isObject(queries)) {
    queriesArr = [queries];
  } else if (isArrayOfObject(queries)) {
    queriesArr = <Object[]>queries;
  } else if (isFunction(queries)) {
    queriesArr = (<Function>queries)(WhereTool);
    if (!isArrayOfObject(queriesArr)) {
      queriesArr = [queriesArr];
    }
  } else {
    return data;
  }

  const matchesQuery = (item: WhereItem, query: Object) =>
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
};

export default where;
