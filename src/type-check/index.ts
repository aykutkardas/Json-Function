type TypeCheckFunction = (value: any) => boolean;
type OneOfCheckFunction = (value: any, options: any[]) => boolean;
type GetTypeFunction = (value: any) => string;

const getType: GetTypeFunction = value => toString.call(value);

const isNumber: TypeCheckFunction = value =>
  value && typeof value === "number" && !isNaN(value);

const isArray: TypeCheckFunction = value => value && Array.isArray(value);

const isArrayOfString: TypeCheckFunction = value =>
  value &&
  isArray(value) &&
  !value.map((val: any) => isString(val)).includes(false);

const isArrayOfObject: TypeCheckFunction = value =>
  value &&
  isArray(value) &&
  !value.map((val: any) => isObject(val)).includes(false);

const isObject: TypeCheckFunction = value =>
  value && getType(value) === "[object Object]";

const isString: TypeCheckFunction = value => value && typeof value === "string";

const isDefined: TypeCheckFunction = value => value !== undefined;

const isOneOf: OneOfCheckFunction = (value, options) =>
  isArray(options) ? options.includes(value) : false;

export {
  isNumber,
  isArray,
  isArrayOfString,
  isArrayOfObject,
  isString,
  isDefined,
  isOneOf,
  isObject
};
