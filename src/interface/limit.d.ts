/**
 * `Limit` is used to get a limited number of elements from a json data. Almost javascript works like `slice()` but it is much easier and clearer.
 */
export type LimitFunction = (
  data: any[], 
  limit: number, 
  start?: number
) => any[];