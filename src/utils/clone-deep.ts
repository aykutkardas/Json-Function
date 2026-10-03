import { isArray, isObject } from "./type-check";

// Copies plain objects and arrays without touching the source. Other values
// (functions, dates, ...) are shared, which is what schema definitions need.
export default function cloneDeep<T>(value: T): T {
  if (isArray(value)) {
    return value.map(cloneDeep) as T;
  }

  if (!isObject(value)) {
    return value;
  }

  const result: Record<string, unknown> = {};

  Object.keys(value).forEach(key => {
    result[key] = cloneDeep(value[key]);
  });

  return result as T;
}
