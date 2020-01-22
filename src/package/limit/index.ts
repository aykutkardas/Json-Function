import { isArray, isNumber } from "utils/type-check";

import { LimitFunction } from 'interface/limit';

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
