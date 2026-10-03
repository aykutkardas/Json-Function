type AnyObject = Record<string, any>;

const getType = (value: unknown): string => Object.prototype.toString.call(value);

const isDefined = (value: unknown): boolean => value !== undefined;

const isNumber = (value: unknown): value is number =>
  typeof value === "number" && !isNaN(value);

const isNull = (value: unknown): value is null => value === null;

const isString = (value: unknown): value is string => typeof value === "string";

const isFunction = (value: unknown): value is (...args: any[]) => any =>
  typeof value === "function";

const isArray = (value: unknown): value is any[] => Array.isArray(value);

const isArrayOfString = (value: unknown): value is string[] =>
  isArray(value) && value.every(isString);

const isArrayOfObject = (value: unknown): value is AnyObject[] =>
  isArray(value) && value.every(isObject);

const isObject = (value: unknown): value is AnyObject =>
  Boolean(value) && getType(value) === "[object Object]";

const isOneOf = (value: unknown, options: unknown): boolean =>
  isArray(options) ? options.includes(value) : false;

const isSchemeToolsObject = (value: unknown): boolean =>
  isObject(value) && isObject(value.__schema__);

export type { AnyObject };

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
