import { isArray, isObject, isArrayOfObject } from "../../utils/type-check";
import { TransformFunction, TransformKeysFn, ProcessValFn } from '../../interface/transform';

const transformKeys: TransformKeysFn = (obj) => {

  const tempObj = Object.entries(obj).map(([key, val]) => [
    key.replace(/_(.)/g, g => g[1].toUpperCase()),
    processVal(val)
  ]);

  const newObject = {};
  tempObj.forEach(([key, val]) => {
    newObject[key] = val;
  });

  return newObject;
};

const processVal: ProcessValFn = (val) => {
  if (!val || typeof val !== "object") {
    return val;
  } else if (isArray(val)) {
    return val.map(transformKeys);
  } else {
    return transformKeys(val);
  }
};

const transform: TransformFunction = data => {
  if (isArrayOfObject(data)) {
    return (<Object[]>data).map(item => transformKeys(item));
  } else if (isObject(data)) {
    return transformKeys(data);
  }

  return null;
};

export default transform;
