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

// Builds the per-item projection once. Returns null when the columns are
// invalid and the data should be returned as it is.
export const compileSelect = (
  columns: string | string[],
  options?: SelectOptions
): ((item: any) => AnyObject) | null => {
  let columnsArr: string[];

  if (isString(columns)) {
    columnsArr = [columns];
  } else if (isArray(columns)) {
    columnsArr = columns;
  } else {
    return null;
  }

  if (options && options.deep) {
    const getters = columnsArr.map(column => getObjDeepProp(column));

    return item => {
      const newItem = {};
      for (let i = 0; i < columnsArr.length; i++) {
        const value = getters[i](item);
        if (isDefined(value)) {
          setDeep(newItem, columnsArr[i], value);
        }
      }
      return newItem;
    };
  }

  return (item: AnyObject) => {
    const newItem: AnyObject = {};
    for (let i = 0; i < columnsArr.length; i++) {
      const column = columnsArr[i];
      if (isDefined(item[column])) {
        newItem[column] = item[column];
      }
    }
    return newItem;
  };
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

  const project = compileSelect(columns, options);

  return project ? data.map(project) : data;
}

export default select;
