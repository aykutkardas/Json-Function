import { isArray, isString, isDefined, isObject, AnyObject } from "../../utils/type-check";
import getObjDeepProp from "../../utils/get-obj-deep-prop";
import setOwn from "../../utils/set-own";

export type SelectOptions = {
  deep?: boolean;
};

// Writes value at a dotted path, creating the intermediate objects:
// setDeep({}, "user.name", "John") -> { user: { name: "John" } }
// Only own properties are walked, so a path like "__proto__.x" creates a
// "__proto__" key instead of writing to Object.prototype.
const setDeep = (target: AnyObject, path: string, value: unknown) => {
  const keys = path.split(".");
  const lastKey = keys.pop() as string;
  let current = target;

  keys.forEach(key => {
    const next = Object.prototype.hasOwnProperty.call(current, key) ? current[key] : undefined;

    if (isObject(next)) {
      current = next;
    } else {
      const created = {};
      setOwn(current, key, created);
      current = created;
    }
  });

  setOwn(current, lastKey, value);
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

  // setOwn on every write is about twice as slow, so it is only used when a
  // column actually needs it.
  const write = columnsArr.indexOf("__proto__") === -1
    ? (target: AnyObject, key: string, value: unknown) => { target[key] = value; }
    : setOwn;

  return (item: AnyObject) => {
    const newItem: AnyObject = {};
    for (let i = 0; i < columnsArr.length; i++) {
      const column = columnsArr[i];
      if (isDefined(item[column])) {
        write(newItem, column, item[column]);
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
