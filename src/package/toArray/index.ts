import { isObject, isArrayOfObject } from "../../utils/type-check";

import { ToArrayFunction } from "../../interface/toArray";

const toArray: ToArrayFunction = (data, config) => {
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
};

export default toArray;
