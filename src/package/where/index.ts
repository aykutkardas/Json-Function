import {
  isArray,
  isObject,
  isFunction,
  isArrayOfObject,
} from "../../utils/type-check";
import getObjDeepProp from "../../utils/get-obj-deep-prop";
import WhereTool from "./tool/callback";

type WhereFunction = (
  data: Object[],
  queries: Object | Object[] | Function,
  options?: {
    deep?: boolean;
  }
) => Object[];

const where: WhereFunction = (data, queries, options) => {
  if (!isArrayOfObject(data)) {
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

  return data.filter((item) => {
    return queriesArr.some((query) => {
      return Object.keys(query).every((fieldName) => {
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
  });
};

export default where;
