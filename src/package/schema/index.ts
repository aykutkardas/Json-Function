import { isFunction, isObject, isArrayOfObject, AnyObject } from "../../utils/type-check.js";
import SchemaTools, { SchemaToolObject, SchemaTools as SchemaToolsType } from "./tool/callback.js";
import compileSchema from "./tool/compile-schema.js";

// Strings are dotted paths read from each item; nested objects build nested
// output.
export type SchemaDefinition = {
  [key: string]: string | SchemaToolObject | SchemaDefinition;
};

export type SchemaInput =
  | SchemaDefinition
  | ((sc: SchemaToolsType) => SchemaDefinition);

function schema(data: object[], schema: SchemaInput): AnyObject[];
function schema(data: object, schema: SchemaInput): AnyObject;
function schema(data: unknown, schema: SchemaInput): AnyObject[] | AnyObject | null;
function schema(
  data: unknown,
  schema: SchemaInput = {}
): AnyObject[] | AnyObject | null {
  const isList = isArrayOfObject(data);

  if (!isList && !isObject(data)) {
    return null;
  }

  let schemaObj: AnyObject;
  if (isFunction(schema)) {
    schemaObj = schema(SchemaTools);
  } else if (isObject(schema)) {
    schemaObj = schema;
  } else {
    return data;
  }

  const build = compileSchema(schemaObj);

  return isList ? (data as AnyObject[]).map(build) : build(data as AnyObject);
}

export default schema;
