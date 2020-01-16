import { isArray, isNumber } from "./type-check";

type LimitFunction = (data: any[], limit: number, start?: number) => any[];

const limit: LimitFunction = (data, limit, start) => {
  if (!isArray(data)) {
    return [];
  }

  if (!isNumber(limit)) {
    limit = 10;
  }

  if (!isNumber(start)) {
    start = 0;
  }

  return data.slice(start, limit + start);
};

export default limit;
