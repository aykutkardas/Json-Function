import { isArray, isObject, isArrayOfObject } from "./type-check";
import getObjDeepProp from "./utils/get-obj-deep-prop";

type WhereFunction = (
  data: Object[],
  queries: Object | Object[],
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
  } else {
    return data;
  }

  let matchingItems: Object[] = [];
  let result: Object[] = [];

  queriesArr.forEach(query => {
    Object.keys(query).forEach(fieldName => {
      matchingItems = data.filter((item, index) => {
        let value = item[fieldName];
        if (options && options.deep) {
          value = getObjDeepProp(item, fieldName);
        }
        return value === query[fieldName];
      });
    });

    result = [...result, ...matchingItems];
    matchingItems = [];
  });

  return result;
};

export default where;
