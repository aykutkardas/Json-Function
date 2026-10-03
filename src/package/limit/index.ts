import { isArray, isNumber } from "../../utils/type-check";

function limit<T>(data: T[], limit?: number, start?: number): T[] {
  if (!isArray(data)) {
    return [];
  }

  const count = isNumber(limit) ? limit : 10;
  const from = isNumber(start) ? start : 0;

  return data.slice(from, count + from);
}

export default limit;
