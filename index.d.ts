declare module "json-function" {
  // { innerJoin } Function
  export function innerJoin(
    data: Object[],
    otherData: Object[],
    dataFieldName: string,
    otherDataFieldName: string
  ): Object[];

  // { where } Function
  export function where(
    data: Object[],
    queries: Object | Object[],
    options?: {
      deep?: boolean;
    }
  ): Object[];

  // { limit } Function
  export function limit(data: any[], limit: number, start?: number): any[];

  // { orderBy } Function
  export function orderBy(
    data: Object[],
    fieldName: string,
    order?: string
  ): Object[];

  // { schema } Function
  export function schema(data: Object[], schema: Object | Function): Object[];

  // { select } Function
  export function select(data: Object[], columns: string | string[]): Object[];

  /* ****************************************************** */

  // JsonFunction.where Method
  function _where(
    queries: Object | Object[],
    options?: {
      deep?: boolean;
    }
  ): JsonFunctionClass;

  // JsonFunction.where Method
  function _innerJoin(
    otherData: Object[],
    dataFieldName: string,
    otherDataFieldName: string
  ): JsonFunctionClass;

  // JsonFunction.limit Method
  export function _limit(limit: number, start?: number): JsonFunctionClass;

  // JsonFunction.orderBy Method
  export function _orderBy(
    fieldName: string,
    order?: string
  ): JsonFunctionClass;

  // JsonFunction.schema Method
  export function _schema(schema: Object | Function): JsonFunctionClass;

  // JsonFunction.select Method
  export function _select(columns: string | string[]): JsonFunctionClass;

  // JsonFuncttion.get Method

  export namespace JsonFunctionProperty {
    type Option = {
      orderBy: string[];
      where: object | object[];
      limit: number[];
      select: string | string[];
      schema: Object;
      innerJoin: [Object[], string, string];
    };

    type Config = {
      resetRecord?: boolean;
      query?: Option;
      [key: string]: any;
    };
  }

  export function _get(
    data: Object[],
    options?: {
      query?: JsonFunctionProperty.Option;
    }
  );

  // JsonFunction.getQuery Method
  export function _getQuery(): JsonFunctionProperty.Option;

  // JsonFunction.setQuery Method
  export function _setQuery(
    query: JsonFunctionProperty.Option
  ): JsonFunctionClass;

  // JsonFunction
  interface JsonFunctionClass {
    option: JsonFunctionProperty.Option;
    config: JsonFunctionProperty.Config;
    where: typeof _where;
    innerJoin: typeof _innerJoin;
    limit: typeof _limit;
    orderBy: typeof _orderBy;
    schema: typeof _schema;
    select: typeof _select;
    get: typeof _get;
    getQuery: typeof _getQuery;
    setQuery: typeof _setQuery;
  }

  const module: JsonFunctionClass;

  export default module;
}
