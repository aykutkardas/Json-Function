import { isArray, isObject, isFunction, isArrayOfObject } from "./type-check";
import getObjDeepProp from "./utils/get-obj-deep-prop";
import WhereTool from "./where-tool";

type WhereFunction = (
  data: Object[],
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
    queriesArr = [(<Function>queries)(WhereTool)];
  } else {
    return data;
  }

  let result = [];

  queriesArr.forEach(query => {
    let temp = data;

    Object.keys(query).forEach(fieldName => {

      temp = temp.filter(item => {

        let value = item[fieldName];
        const activeQuery = query[fieldName];

        if (options && options.deep) {
          value = getObjDeepProp(fieldName)(item);
        }

        if (isObject(activeQuery) && activeQuery.type) {
          const { type, value: argValue } = activeQuery;
          if (type === ">") {
            return value > argValue;
          } else if (type === ">=") {
            return value >= argValue;
          } else if (type === "<") {
            return value < argValue;
          } else if (type === "<=") {
            return value <= argValue;
          } else if (type === "includes") {
            return value.includes(argValue);
          } else if (type === "!includes") {
            return !value.includes(argValue);
          } else if (type === "==") {
            return value == argValue;
          } else if (type === "!=") {
            return value != argValue;
          } else if (type === "between") {
            const [min, max] = argValue;
            return value >= min && value <= max;
          }

          return false;
        }

        return value === activeQuery;
      });
    });

    result = [...result, ...temp];
  });

  return result;
}

export default where;
