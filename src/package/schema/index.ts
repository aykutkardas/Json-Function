import { isFunction, isObject, isArrayOfObject, AnyObject } from "../../utils/type-check";
import SchemaTools, { SchemaToolObject, SchemaTools as SchemaToolsType } from "./tool/callback";
import getSchemaValue from "./tool/get-schema-value";
import { cloneDeep } from "../../utils";

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

  if (isArrayOfObject(data)) {
    return data.map(item => {
      const temp = cloneDeep(schemaObj);
      return getSchemaValue(temp, item);
    });
  }

  const temp = cloneDeep(schemaObj);
  return getSchemaValue(temp, data);
}

export default schema;
