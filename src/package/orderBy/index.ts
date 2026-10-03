import { isArray, isString, isOneOf } from "../../utils/type-check";
import getObjDeepProp from "../../utils/get-obj-deep-prop";

// The string fallback keeps lower case and runtime values accepted while the
// literals still show up in autocomplete.
export type Order = "ASC" | "DESC" | (string & {});

export type OrderByOptions = {
  deep?: boolean;
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

  if (!isString(fieldName)) {
    return data;
  }

  const direction = isString(order) ? order.toUpperCase() : "ASC";

  if (!isOneOf(direction, ["ASC", "DESC"])) {
    return data;
  }

  return [...data].sort((a: any, b: any) => {
    let firstValue = a[fieldName];
    let secondValue = b[fieldName];

    if (options && options.deep) {
      firstValue = getObjDeepProp(fieldName)(a);
      secondValue = getObjDeepProp(fieldName)(b);
    }

    if (direction === "DESC") {
      return secondValue > firstValue ? 1 : firstValue > secondValue ? -1 : 0;
    }

    return firstValue > secondValue ? 1 : secondValue > firstValue ? -1 : 0;
  });
}

export default orderBy;
