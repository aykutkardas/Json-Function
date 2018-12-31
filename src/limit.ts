type LimitFunction = (data: any[], limit: number, start?: number) => any[];

const limit: LimitFunction = (data = [], limit = 10, start = 0) => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.slice(start, limit + start);
};

export default limit;
