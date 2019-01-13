import { isArray, isObject, isArrayOfObject } from "./type-check";

type WhereFunction = (data: Object[], queries: Object | Object[]) => Object[];

const where: WhereFunction = (data, queries) => {
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
        if (item[fieldName] === query[fieldName]) {
          return true;
        }
      });
    });

    result = [...result, ...matchingItems];
    matchingItems = [];
  });

  return result;
};

export default where;
