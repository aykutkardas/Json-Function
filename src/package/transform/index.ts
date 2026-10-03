import { isArray, isObject, AnyObject } from "../../utils/type-check";
import setOwn from "../../utils/set-own";

const MAX_CACHE_SIZE = 5000;
const keyCache = new Map<string, string>();

// Records usually share the same keys, so each key is converted once.
const toCamelCase = (key: string): string => {
  let converted = keyCache.get(key);

  if (converted === undefined) {
    converted = key.indexOf("_") === -1 ? key : key.replace(/_(.)/g, g => g[1].toUpperCase());
    // Data with unbounded key sets (ids as keys) must not grow the cache forever.
    if (keyCache.size >= MAX_CACHE_SIZE) {
      keyCache.clear();
    }
    keyCache.set(key, converted);
  }

  return converted;
};

const transformKeys = (obj: AnyObject): AnyObject => {
  const newObject: AnyObject = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = toCamelCase(key);
      // Keys like "____proto____" become "__proto__" after conversion. The
      // check stays here so the common path is a plain property write.
      if (newKey === "__proto__") {
        setOwn(newObject, newKey, processVal(obj[key]));
      } else {
        newObject[newKey] = processVal(obj[key]);
      }
    }
  }

  return newObject;
};

// Only plain objects get their keys converted. Arrays are walked so their
// object elements are converted too, while primitives, nested arrays and
// other objects (Date, Map, ...) keep their shape.
const processVal = (val: unknown): any => {
  if (isArray(val)) {
    return val.map(processVal);
  }

  if (isObject(val)) {
    return transformKeys(val);
  }

  return val;
};

function transform(data: object[]): AnyObject[];
function transform(data: object): AnyObject;
function transform(data: unknown): AnyObject[] | AnyObject | null;
function transform(data: unknown): AnyObject[] | AnyObject | null {
  if (isArray(data) || isObject(data)) {
    return processVal(data);
  }

  return null;
}

export default transform;
