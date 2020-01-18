// https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript

import { isNull, isObject } from './type-check';

export default function cloneDeep(object) {
  if (
    isNull(object) 
    || !isObject(object) 
    || "isActiveClone" in object
  ) {
    return object;
  }

  const newObject: Object = object.constructor();

  for (const key in object) {

    if (!Object.prototype.hasOwnProperty.call(object, key)) {
      continue;
    }

    object.isActiveClone = null;
    newObject[key] = cloneDeep(object[key]);
    delete object.isActiveClone;
  }

  return newObject;
}
