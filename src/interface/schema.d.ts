/**
 * The `Schema` function is a great way to reconfigure your json data and make it your own.
 */
export type SchemaFunction = (
  data: Object[] | Object,
  schema: Object | Function
) => Object[] | Object;

export type GetSchemaValueFunction = (
  schema: Object, 
  item: Object
) => Object

export interface SchemaToolObject {
  __schema__: {
    job?: string;
    values?: string[];
    separator?: string;
    custom?: Function;
  };
}

export type SchemaToolGenerator = (
    object: SchemaToolObject, 
    item: Object
) => any
