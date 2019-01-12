type TypeCheckFunction = (value: any) => boolean;

const isNumber: TypeCheckFunction = value =>
  value && typeof value === "number" && !isNaN(value);

const isArray: TypeCheckFunction = value => value && Array.isArray(value);

const isString: TypeCheckFunction = value => value && typeof value === "string";

const isDefined: TypeCheckFunction = value => value !== undefined;

export { isNumber, isArray, isString, isDefined };
