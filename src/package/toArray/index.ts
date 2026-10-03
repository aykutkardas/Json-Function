import { isObject, isArrayOfObject, AnyObject } from "../../utils/type-check";

export type ToArrayConfig = {
  key?: string;
};

function toArray(data: unknown, config?: ToArrayConfig): AnyObject[] {
  if (isArrayOfObject(data)) {
    return data;
  }

  if (!isObject(data)) {
    return [];
  }

  let key: string = "uid";

  if (isObject(config) && config.key) {
    key = config.key;
  }

  return Object.keys(data).map(currentKey => ({
    [key]: currentKey,
    ...data[currentKey]
  }));
}

export default toArray;
