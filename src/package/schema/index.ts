import { isFunction, isObject, isArrayOfObject, AnyObject } from "../../utils/type-check";
import SchemaTools, { SchemaToolObject, SchemaTools as SchemaToolsType } from "./tool/callback";
import compileSchema from "./tool/compile-schema";

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
  if (!isArrayOfObject(data) && !isObject(data)) {
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

  return isArrayOfObject(data) ? data.map(build) : build(data);
}

export default schema;
