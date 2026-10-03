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

// True when every key is a number (not NaN) or every key is a string. Only
// then is the comparator a consistent order, so sorting a subset or keeping
// the top items gives the same result as a full sort. With mixed or missing
// keys the outcome depends on which items are compared, and callers must
// run the full sort on the same input as orderBy() would.
export const hasTotalOrder = (data: unknown[], spec: SortSpec): boolean => {
  if (data.length === 0) {
    return true;
  }

  const type = typeof spec.get(data[0]);

  if (type !== "number" && type !== "string") {
    return false;
  }

  for (let i = 0; i < data.length; i++) {
    const key = spec.get(data[i]);
    if (typeof key !== type || key !== key) {
      return false;
    }
  }

  return true;
};

// Returns sortBySpec(data, spec).slice(0, k) without sorting everything: a
// bounded max-heap keeps the k best items, O(n log k) instead of O(n log n).
// Falls back to a full sort when k is large or the keys have no total order
// (see hasTotalOrder).
export const topKBySpec = <T>(data: T[], spec: SortSpec, k: number): T[] => {
  const length = data.length;

  if (k <= 0) {
    return [];
  }

  if (k * 4 > length || !hasTotalOrder(data, spec)) {
    return sortBySpec(data, spec).slice(0, k);
  }

  const keys = new Array(length);

  for (let i = 0; i < length; i++) {
    keys[i] = spec.get(data[i]);
  }

  const sign = spec.desc ? -1 : 1;
  // Negative when item i comes before item j in the sorted output.
  const before = (i: number, j: number) => sign * compareValues(keys[i], keys[j]) || i - j;

  // heap[0] is the item that would come last among the ones kept so far.
  const heap: number[] = [];

  const siftUp = (position: number) => {
    while (position > 0) {
      const parent = (position - 1) >> 1;
      if (before(heap[parent], heap[position]) >= 0) {
        return;
      }
      [heap[parent], heap[position]] = [heap[position], heap[parent]];
      position = parent;
    }
  };

  const siftDown = (position: number) => {
    for (;;) {
      const left = position * 2 + 1;
      const right = left + 1;
      let largest = position;
      if (left < heap.length && before(heap[left], heap[largest]) > 0) {
        largest = left;
      }
      if (right < heap.length && before(heap[right], heap[largest]) > 0) {
        largest = right;
      }
      if (largest === position) {
        return;
      }
      [heap[largest], heap[position]] = [heap[position], heap[largest]];
      position = largest;
    }
  };

  for (let i = 0; i < length; i++) {
    if (heap.length < k) {
      heap.push(i);
      siftUp(heap.length - 1);
    } else if (before(i, heap[0]) < 0) {
      heap[0] = i;
      siftDown(0);
    }
  }

  return heap.sort(before).map(i => data[i]);
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
