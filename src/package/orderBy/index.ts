import { isArray, isString, isOneOf } from "../../utils/type-check";
import getObjDeepProp from "../../utils/get-obj-deep-prop";

type OrderByConfig = {
  deep: boolean;
};

type OrderByFunction = (
  data: Object[],
  fieldName: string,
  order?: string,
  config?: OrderByConfig
) => Object[];

const orderBy: OrderByFunction = (data, fieldName, order = "ASC", config) => {
  if (!isArray(data)) {
    return [];
  }

  if (!isString(fieldName)) {
    return data;
  }

  if (!isString(order)) {
    order = "ASC";
  }

  order = order.toUpperCase();

  if (!isOneOf(order, ["ASC", "DESC"])) {
    return data;
  }

  return data.sort((a, b) => {
    let firstValue = a[fieldName];
    let secondValue = b[fieldName];

    if (config && config.deep) {
      firstValue = getObjDeepProp(fieldName)(a);
      secondValue = getObjDeepProp(fieldName)(b);
    }

    if (order === "DESC") {
      return secondValue > firstValue ? 1 : firstValue > secondValue ? -1 : 0;
    }

    return firstValue > secondValue ? 1 : secondValue > firstValue ? -1 : 0;
  });
};

export default orderBy;
