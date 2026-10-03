import { isArray, isObject } from "../../utils/type-check";

type TransformFunction = (data: Object[] | Object) => Object[] | Object;

const transformKeys = (obj: Object): Object => {
  const newObject = {};

  Object.keys(obj).forEach(key => {
    newObject[key.replace(/_(.)/g, g => g[1].toUpperCase())] = processVal(obj[key]);
  });

  return newObject;
};

// Only plain objects get their keys converted. Arrays are walked so their
// object elements are converted too, while primitives, nested arrays and
// other objects (Date, Map, ...) keep their shape.
const processVal = (val: any): any => {
  if (isArray(val)) {
    return val.map(processVal);
  }

  if (isObject(val)) {
    return transformKeys(val);
  }

  return val;
};

const transform: TransformFunction = data => {
  if (isArray(data) || isObject(data)) {
    return processVal(data);
  }

  return null;
};

export default transform;
