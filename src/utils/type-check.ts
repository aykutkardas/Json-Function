type TypeCheckFunction = (value: any) => boolean;
type OneOfCheckFunction = (value: any, options: any[]) => boolean;
type GetTypeFunction = (value: any) => string;

const getType: GetTypeFunction = value => Object.prototype.toString.call(value);

const isDefined: TypeCheckFunction = value => value !== undefined;

const isNumber: TypeCheckFunction = value =>
  typeof value === "number" && !isNaN(value);

const isNull: TypeCheckFunction = value => value === null;

const isString: TypeCheckFunction = value => typeof value === "string";

const isFunction: TypeCheckFunction = value => typeof value === "function";

const isArray: TypeCheckFunction = value => Array.isArray(value);

const isArrayOfString: TypeCheckFunction = value =>
  isArray(value) && value.every(isString);

const isArrayOfObject: TypeCheckFunction = value =>
  isArray(value) && value.every(isObject);

const isObject: TypeCheckFunction = value =>
  value && getType(value) === "[object Object]";

const isOneOf: OneOfCheckFunction = (value, options) =>
  isArray(options) ? options.includes(value) : false;

const isSchemeToolsObject: TypeCheckFunction = value =>
  isObject(value) && isObject(value.__schema__);

export {
  isOneOf,
  isArray,
  isString,
  isNumber,
  isNull,
  isObject,
  isDefined,
  isFunction,
  isArrayOfString,
  isArrayOfObject,
  isSchemeToolsObject
};
