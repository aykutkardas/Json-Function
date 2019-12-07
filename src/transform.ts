import { isArray, isObject } from "./type-check";

type TransformFunction = (data: Object[]) => Object[];

const transformKeys = (obj: Object): Object => {
  const tempObj = Object.entries(obj).map(([key, val]) => [
    key.replace(/_(.)/g, g =>  g[1].toUpperCase()),
    processVal(val)
  ]);

  const newObject = {};
  tempObj.forEach(([key, val]) => {
    newObject[key] = val;
  });

  return newObject;
}

const processVal = (val: any): any => {
  if(typeof(val) !== 'object' ) {
    return val;
  } else if (isArray(val)) {
    return val.map(transformKeys);
  } else {
    return transformKeys(val);
  }
} 

const transform: TransformFunction = (data) => {
  if (!isArray(data)) {
    return [];
  }

  return data.map(item => transformKeys(item));
}

export default transform;