import { isArray, isString, isArrayOfString } from "../../utils/type-check";
import getObjDeepProp from "../../utils/get-obj-deep-prop";

export type SearchOptions = {
  caseSensitive?: boolean;
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

type Predicate = (item: any) => boolean;

// Builds the item check once: field getters are resolved up front, and the
// key is matched with String#includes, or one regular expression for case
// insensitive search (its case folding is kept as before). Returns null when
// the fields are invalid.
export const compileSearch = (
  key: unknown,
  fields: string | string[],
  options?: SearchOptions
): Predicate | null => {
  let fieldsArr: string[];

  if (isString(fields)) {
    fieldsArr = [fields];
  } else if (isArrayOfString(fields)) {
    fieldsArr = fields;
  } else {
    return null;
  }

  const getters = fieldsArr.map((field) => getObjDeepProp(field));

  let matches: (value: unknown) => boolean;

  if (isString(key)) {
    const regex =
      options && options.caseSensitive === false
        ? new RegExp(escapeRegExp(key), "i")
        : null;

    matches = (value) => {
      // Missing fields and nested objects must not match by being
      // stringified into "undefined", "null" or "[object Object]".
      if (value === undefined || value === null || typeof value === "object") {
        return false;
      }
      const text = typeof value === "string" ? value : String(value);
      return regex ? regex.test(text) : text.includes(key);
    };
  } else {
    matches = (value) => value === key;
  }

  return (item) => {
    for (let i = 0; i < getters.length; i++) {
      if (matches(getters[i](item))) {
        return true;
      }
    }
    return false;
  };
};

function search<T>(
  data: T[],
  key: unknown,
  fields: string | string[],
  options?: SearchOptions
): T[] {
  if (!isArray(data)) {
    return [];
  }

  const predicate = compileSearch(key, fields, options);

  return predicate ? data.filter(predicate) : data;
}

export default search;
