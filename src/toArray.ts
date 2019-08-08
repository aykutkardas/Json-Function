import { isObject, isArrayOfObject } from "./type-check";

type Config = {
  key: string,
}

type ToArrayFunction = (data: any, config?: Config) => any[];

const toArray: ToArrayFunction = (data, config) => {
  if (isArrayOfObject(data)) {
    return data;
  }

  if(!isObject(data)) {
    return [];
  }

  let key: string = 'uid';

  if (isObject(config) && config.key) {
    key = config.key;
  }

  const arrayData = Object.keys(data).map(currentKey => ({
    [key]: currentKey,
    ...data[currentKey]
  }));

  return arrayData;

};

export default toArray;
