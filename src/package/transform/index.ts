import { isArray, isObject, AnyObject } from "../../utils/type-check";

const transformKeys = (obj: AnyObject): AnyObject => {
  const newObject: AnyObject = {};

  Object.keys(obj).forEach(key => {
    newObject[key.replace(/_(.)/g, g => g[1].toUpperCase())] = processVal(obj[key]);
  });

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
