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

/**
 * The `Where` function provides a comfortable method for filtering a json data.
 */
type Where = (
  queries: Object | Object[],
  options?: {
    deep?: boolean;
  }
) => JsonFunctionClass;

/**
 * JSON converts the `snake_case` keys in your data to `camelCase`.
 */
type Transform = (
  data: Object[] | Object
) => Object[] | Object;

/**
 * The `innerJoin` function is used to join two arrays.
 */
type InnerJoin = (
  otherData: Object[],
  dataFieldName: string,
  otherDataFieldName: string
) => JsonFunctionClass;

/**
 * `Limit` is used to get a limited number of elements from a json data. Almost javascript works like `slice()` but it is much easier and clearer.
 */
type Limit = (
  limit: number,
  start?: number
) => JsonFunctionClass;

/**
 * With the `orderBy` function you can reorder the data in your json array.
 */
type OrderBy = (
  fieldName: string,
  order?: string
) => JsonFunctionClass;

/**
 * The `Schema` function is a great way to reconfigure your json data and make it your own.
 */
type Schema = (
  schema: Object | Function
) => JsonFunctionClass;

/**
 * The `Select` function is a practical method where you only get the desired fields of a json data.
 */
type Select = (
  columns: string | string[]
) => JsonFunctionClass;

/**
 * Create a query and use it at any time.
 */
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
  transform: Transform,
  orderBy: OrderBy,
  schema: Schema,
  select: Select,
  getQuery: GetQuery,
  setQuery: SetQuery,
  get: Get
}