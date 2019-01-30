import { isObject, isString } from "../type-check";

type GetObjDeepPropFunction = (
  obj: Object,
  props: string,
  defaultValue?: any
) => any;

const getObjDeepProp: GetObjDeepPropFunction = (obj, props, defaultValue) => {
  if (!isObject(obj)) {
    return false;
  }

  if (!isString(props)) {
    return obj;
  }

  const propsArr = props.split(".");
  let rootObj: any = obj;

  propsArr.forEach(prop => {
    if (!rootObj) {
      rootObj = false;
      return;
    }
    if (
      typeof rootObj[prop] !== "undefined" ||
      rootObj[prop] !== null ||
      !isNaN(rootObj[prop])
    ) {
      rootObj = rootObj[prop];
      return;
    }
    rootObj = false;
  });

  return rootObj !== false ? rootObj : defaultValue || false;
};

export default getObjDeepProp;
