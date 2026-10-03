import { isArray, isString, isDefined, isObject, AnyObject } from "../../utils/type-check";
import getObjDeepProp from "../../utils/get-obj-deep-prop";

export type SelectOptions = {
  deep?: boolean;
};

// Writes value at a dotted path, creating the intermediate objects:
// setDeep({}, "user.name", "John") -> { user: { name: "John" } }
const setDeep = (target: AnyObject, path: string, value: unknown) => {
  const keys = path.split(".");
  const lastKey = keys.pop() as string;
  let current = target;

  keys.forEach(key => {
    if (!isObject(current[key])) {
      current[key] = {};
    }
    current = current[key];
  });

  current[lastKey] = value;
};

function select<T extends object, K extends keyof T & string>(
  data: T[],
  columns: K | K[]
): Pick<T, K>[];
function select(
  data: object[],
  columns: string | string[],
  options?: SelectOptions
): AnyObject[];
function select(
  data: object[],
  columns: string | string[],
  options?: SelectOptions
): AnyObject[] {
  if (!isArray(data)) {
    return [];
  }

  let columnsArr: string[];

  if (isString(columns)) {
    columnsArr = [columns];
  } else if (isArray(columns)) {
    columnsArr = columns;
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

  return data.map((item: AnyObject) => {
    const newItem: AnyObject = {};
    columnsArr.forEach(column => {
      if (isDefined(item[column])) {
        newItem[column] = item[column];
      }
    });
    return newItem;
  });
}

export default select;
