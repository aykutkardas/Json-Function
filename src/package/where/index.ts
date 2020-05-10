import {
  isArray,
  isObject,
  isFunction,
  isArrayOfObject,
} from "../../utils/type-check";
import getObjDeepProp from "../../utils/get-obj-deep-prop";
import WhereTool from "./tool/callback";

const UNIQUE_IDX_KEY = "_jf_unique_idx_";

const isAlreadyDefine = (result, newItem) =>
  result.find(
    (resultItem) => resultItem[UNIQUE_IDX_KEY] === newItem[UNIQUE_IDX_KEY]
  );

type WhereItem = {
  [UNIQUE_IDX_KEY]?: number;
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
    let temp = data.map((item, index) => {
      if (!item[UNIQUE_IDX_KEY]) {
        item[UNIQUE_IDX_KEY] = index
      }
      return item;
    });

    Object.keys(query).forEach((fieldName) => {
      temp = temp.filter((item) => {
        let value = item[fieldName];
        const activeQuery = query[fieldName];

        if (options && options.deep) {
          value = getObjDeepProp(fieldName)(item);
        }

        if (isFunction(activeQuery)) {
          return activeQuery(value);
        }

        return value === activeQuery;
      });
    });

    temp.forEach((tempItem) => {
      if (!isAlreadyDefine(result, tempItem)) {
        result.push(tempItem);
      }
    });
  });

  return result.map((item) => {
    delete item[UNIQUE_IDX_KEY];
    return item;
  });
};

export default where;
