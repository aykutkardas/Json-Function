import { isArray, isString, isOneOf } from "../../utils/type-check";
import getObjDeepProp from "../../utils/get-obj-deep-prop";

// The string fallback keeps lower case and runtime values accepted while the
// literals still show up in autocomplete.
export type Order = "ASC" | "DESC" | (string & {});

export type OrderByOptions = {
  deep?: boolean;
};

export type SortSpec = {
  get: (item: any) => any;
  desc: boolean;
};

const EMPTY = {} as Record<string, any>;

export const compareValues = (first: any, second: any): number =>
  first > second ? 1 : second > first ? -1 : 0;

// Returns null when the arguments are invalid and the data should be
// returned as it is.
export const compileOrderBy = (
  fieldName: string,
  order: Order = "ASC",
  options?: OrderByOptions
): SortSpec | null => {
  if (!isString(fieldName)) {
    return null;
  }

  const direction = isString(order) ? order.toUpperCase() : "ASC";

  if (!isOneOf(direction, ["ASC", "DESC"])) {
    return null;
  }

  const get =
    options && options.deep
      ? getObjDeepProp(fieldName)
      : (item: any) => (item || EMPTY)[fieldName];

  return { get, desc: direction === "DESC" };
};

// Reads every sort key once and sorts indices, instead of resolving the
// field twice per comparison. Ties keep their input order.
export const sortBySpec = <T>(data: T[], spec: SortSpec): T[] => {
  const length = data.length;
  const keys = new Array(length);
  const indices = new Array<number>(length);
  let numeric = true;

  for (let i = 0; i < length; i++) {
    const key = spec.get(data[i]);
    keys[i] = key;
    indices[i] = i;
    if (typeof key !== "number" || key !== key) {
      numeric = false;
    }
  }

  const sign = spec.desc ? -1 : 1;

  indices.sort(
    numeric
      ? (i, j) => sign * (keys[i] - keys[j]) || i - j
      : (i, j) => sign * compareValues(keys[i], keys[j]) || i - j
  );

  const result = new Array<T>(length);
  for (let i = 0; i < length; i++) {
    result[i] = data[indices[i]];
  }
  return result;
};

function orderBy<T>(
  data: T[],
  fieldName: string,
  order: Order = "ASC",
  options?: OrderByOptions
): T[] {
  if (!isArray(data)) {
    return [];
  }

  const spec = compileOrderBy(fieldName, order, options);

  return spec ? sortBySpec(data, spec) : data;
}

export default orderBy;
