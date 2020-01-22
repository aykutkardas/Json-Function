/**
 * The `Where` function provides a comfortable method for filtering a json data.
 */
export type WhereFunction = (
  data: Object[],
  queries: Object | Object[] | Function,
  options?: {
    deep?: boolean;
  }
) => Object[];

export interface WhereToolObject {
  lt: (input: number) => (value: any) => boolean,
  lte: (input: number) => (value: any) => boolean,
  gt: (input: number) => (value: any) => boolean,
  gte: (input: number) => (value: any) => boolean,
  eq: (input: any) => (value: any) => boolean,
  ne: (input: any) => (value: any) => boolean,
  in: (input: any) => (value: any) => boolean,
  nin: (input: any) => (value: any) => boolean,
  between: (min: number, max: number) => (value: any) => boolean,
}