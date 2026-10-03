import { isString, isObject, isFunction, isSchemeToolsObject, AnyObject } from "../../../utils/type-check";
import getObjDeepProp from "../../../utils/get-obj-deep-prop";
import { SchemaToolObject } from "./callback";

type FieldBuilder = (item: AnyObject) => unknown;

const compileTool = ({ __schema__ }: SchemaToolObject): FieldBuilder => {
  const { job, separator = " ", values = [], custom } = __schema__;
  const getters = values.map(path => getObjDeepProp(path));
  const read = (item: AnyObject) => getters.map(get => get(item));

  if (job === "join") {
    return item => read(item).join(separator);
  }

  if (job === "custom" && isFunction(custom)) {
    return item => custom(...read(item));
  }

  return () => undefined;
};

// Turns a schema definition into a function that builds one output object.
// Paths, tools and nested objects are resolved once here instead of cloning
// and walking the definition for every item.
const compileSchema = (schema: AnyObject): ((item: AnyObject) => AnyObject) => {
  const fields: [string, FieldBuilder][] = Object.keys(schema).map(key => {
    const field = schema[key];

    if (isString(field)) {
      return [key, getObjDeepProp(field)];
    }

    if (isSchemeToolsObject(field)) {
      return [key, compileTool(field as SchemaToolObject)];
    }

    if (isObject(field)) {
      return [key, compileSchema(field)];
    }

    // Any other value is copied to the output as it is.
    return [key, () => field];
  });

  return item => {
    const result: AnyObject = {};
    for (let i = 0; i < fields.length; i++) {
      result[fields[i][0]] = fields[i][1](item);
    }
    return result;
  };
};

export default compileSchema;
