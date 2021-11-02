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

  let result = [];

  queriesArr.forEach((query) => {
    data.forEach((item) => {
      const fields = Object.keys(query);
      const isMultipleWhere = fields.length > 1;
      let isMatches = [];

      fields.forEach((fieldName) => {
        let isMatch = false;

        let value = item[fieldName];
        const activeQuery = query[fieldName];

        if (options && options.deep) {
          value = getObjDeepProp(fieldName)(item);
        }

        if (isFunction(activeQuery)) {
          isMatch = activeQuery(value);
        }

        if (value === activeQuery) {
          isMatch = value === activeQuery;
        }

        if (isMultipleWhere) {
          isMatches.push(isMatch);
        } else {
          isMatches = [isMatch];
        }
      });

      if (isMatches.every((i) => i)) {
        result.push(item);
        isMatches = [];
      }
    });
  });

  return result;
};

export default where;
