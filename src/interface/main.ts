export type Option = {
  orderBy: string[];
  where: object | object[];
  limit: number[];
  select: string | string[];
  schema: Object;
  innerJoin: [Object[], string, string];
}

export type Config = {
  resetRecord?: boolean;
  query?: Option;
  [key: string]: any;
};

type Where = (
  queries: Object | Object[],
  options?: {
    deep?: boolean;
  }
) => JsonFunctionClass;

type InnerJoin = (
  otherData: Object[],
  dataFieldName: string,
  otherDataFieldName: string
) => JsonFunctionClass;

type Limit = (
  limit: number,
  start?: number
) => JsonFunctionClass;

type OrderBy = (
  fieldName: string,
  order?: string
) => JsonFunctionClass;

type Schema = (
  schema: Object | Function
) => JsonFunctionClass;

type Select = (
  columns: string | string[]
) => JsonFunctionClass;

type GetQuery = () => Option;

type SetQuery = (query: Option) => JsonFunctionClass;

type Get = (
  data: Object | Object[],
  options?: {
    query?: Option,
    [key: string]: any
  }
) => Object | Object[];

export interface JsonFunctionClass {
  option: Option;
  config: Config;
  where: Where;
  innerJoin: InnerJoin,
  limit: Limit,
  orderBy: OrderBy,
  schema: Schema,
  select: Select,
  getQuery: GetQuery,
  setQuery: SetQuery,
  get: Get
}