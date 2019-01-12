type TypeCheckFunction = (value: any) => boolean;
type OneOfCheckFunction = (value: any, options: any[]) => boolean;

const isNumber: TypeCheckFunction = value =>
  value && typeof value === "number" && !isNaN(value);

const isArray: TypeCheckFunction = value => value && Array.isArray(value);

const isString: TypeCheckFunction = value => value && typeof value === "string";

const isDefined: TypeCheckFunction = value => value !== undefined;

const isOneOf: OneOfCheckFunction = (value, options) => isArray(options) ? options.includes(value) : false;

export { isNumber, isArray, isString, isDefined, isOneOf };
