import { isArray, isObject } from "./type-check";

type TransformFunction = (data: Object[]) => Object[];

const renameKeys = (obj: Object): Object => {
  const temp = Object.entries(obj).map(([key, val]) => [
    key.replace(/_(.)/g, g =>  g[1].toUpperCase()),
    processVal(val)
  ]);

  const newObject = {};
  temp.forEach(([key, val]) => {
    newObject[key] = val;
  });

  return newObject;
}

const processVal = (val: any): any => {
  if(typeof(val) !== 'object' ) {
    return val;
  } else if (isArray(val)) {
    return val.map(renameKeys);
  } else {
    return renameKeys(val);
  }
} 

const transform: TransformFunction = (data) => {
  if (!isArray(data)) {
    return [];
  }

  return data.map(item => renameKeys(item));
}

export default transform;