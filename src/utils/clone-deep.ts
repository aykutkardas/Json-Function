import { isArray, isObject } from "./type-check";

// Copies plain objects and arrays without touching the source. Other values
// (functions, dates, ...) are shared, which is what schema definitions need.
export default function cloneDeep<T>(value: T): T {
  if (isArray(value)) {
    return (value as any).map(cloneDeep);
  }

  if (!isObject(value)) {
    return value;
  }

  const result = {};

  Object.keys(value).forEach(key => {
    result[key] = cloneDeep(value[key]);
  });

  return result as T;
}
