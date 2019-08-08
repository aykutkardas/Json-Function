type TypeCheckFunction = (value: any) => boolean;
type OneOfCheckFunction = (value: any, options: any[]) => boolean;
type GetTypeFunction = (value: any) => string;

const getType: GetTypeFunction = value => toString.call(value);

const isDefined: TypeCheckFunction = value => value !== undefined;

const isNumber: TypeCheckFunction = value => typeof value === "number" && !isNaN(value);

const isString: TypeCheckFunction = value => typeof value === "string";

const isArray: TypeCheckFunction = value => value && Array.isArray(value);

const isArrayOfString: TypeCheckFunction = value => isArray(value) && 
  !value.map((val: any) => isString(val)).includes(false);

const isArrayOfObject: TypeCheckFunction = value => isArray(value) &&
  !value.map((val: any) => isObject(val)).includes(false);

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
  isObject,
  isDefined,
  isArrayOfString,
  isArrayOfObject,
  isSchemeToolsObject
};
