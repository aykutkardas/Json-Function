import { isArray, isString, isOneOf } from "../../utils/type-check";

type OrderByFunction = (
  data: Object[],
  fieldName: string,
  order?: string
) => Object[];

const orderBy: OrderByFunction = (data, fieldName, order = "ASC") => {
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

  if (order === "DESC") {
    return data.sort((a, b) =>
      b[fieldName] > a[fieldName] ? 1 : a[fieldName] > b[fieldName] ? -1 : 0
    );
  }

  return data.sort((a, b) =>
    a[fieldName] > b[fieldName] ? 1 : b[fieldName] > a[fieldName] ? -1 : 0
  );
};

export default orderBy;
