import { isArray, isObject, isArrayOfObject } from "../../utils/type-check";

type TransformFunction = (data: Object[] | Object) => Object[] | Object;

const transformKeys = (obj: Object): Object => {
  const tempObj = Object.entries(obj).map(([key, val]) => [
    key.replace(/_(.)/g, g => g[1].toUpperCase()),
    processVal(val)
  ]);

  const newObject = {};
  tempObj.forEach(([key, val]) => {
    // A key like "____proto____" becomes "__proto__", and assigning that
    // would replace the prototype of newObject with data from the input.
    if (key === "__proto__") {
      Object.defineProperty(newObject, key, {
        value: val,
        writable: true,
        enumerable: true,
        configurable: true
      });
    } else {
      newObject[key] = val;
    }
  });

  return newObject;
};

const processVal = (val: any): any => {
  if (!val || typeof val !== "object") {
    return val;
  } 
  
  if (isArray(val)) {
    return val.map(transformKeys);
  }
  
  return transformKeys(val);
};

const transform: TransformFunction = data => {
  if (isArrayOfObject(data)) {
    return (<Object[]>data).map(item => transformKeys(item));
  } 
  
  if (isObject(data)) {
    return transformKeys(data);
  }

  return null;
};

export default transform;
