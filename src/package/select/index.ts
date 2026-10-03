import { isArray, isString, isDefined, isObject } from "../../utils/type-check";
import getObjDeepProp from "../../utils/get-obj-deep-prop";

type SelectFunction = (
  data: Object[],
  columns: string | string[],
  options?: {
    deep?: boolean;
  }
) => Object[];

// Writes value at a dotted path, creating the intermediate objects:
// setDeep({}, "user.name", "John") -> { user: { name: "John" } }
const setDeep = (target: Object, path: string, value: any) => {
  const keys = path.split(".");
  const lastKey = keys.pop();
  let current = target;

  keys.forEach(key => {
    if (!isObject(current[key])) {
      current[key] = {};
    }
    current = current[key];
  });

  current[lastKey] = value;
};

const select: SelectFunction = (data, columns, options) => {
  if (!isArray(data)) {
    return [];
  }

  let columnsArr: string[];

  if (isString(columns)) {
    columnsArr = [<string>columns];
  } else if (isArray(columns)) {
    columnsArr = <string[]>columns;
  } else {
    return data;
  }

  if (options && options.deep) {
    return data.map(item => {
      const newItem = {};
      columnsArr.forEach(column => {
        const value = getObjDeepProp(column)(item);
        if (isDefined(value)) {
          setDeep(newItem, column, value);
        }
      });
      return newItem;
    });
  }

  return data.map(item => {
    const newItem = {};
    columnsArr.forEach(column => {
      if (isDefined(item[column])) {
        newItem[column] = item[column];
      }
    });
    return newItem;
  });
};

export default select;
