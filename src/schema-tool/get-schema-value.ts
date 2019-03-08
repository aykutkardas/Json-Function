import { SchemaToolObject } from "./";
import getObjDeepProp from "../utils/get-obj-deep-prop";
import { isString, isObject } from '../type-check';

type SchemaFunction = (
  schema: Object,
  item: Object,
  fields: string[]
) => Object;

const isSchemeToolsObject = (obj: SchemaToolObject) =>
  obj instanceof Object && obj.__schema__;

const schemaToolGenerator = (obj: SchemaToolObject, item: Object) => {
  const { __schema__ } = obj;
  const { job, seperator = " " } = __schema__;
  let { values = [] } = __schema__;

  values = values.map((value: string) => getObjDeepProp(value)(item));

  if (job === "join") {
    return values.join(seperator);
  }

  if (job === "custom") {
    const { custom } = __schema__;
    if (typeof custom === 'function') {
      return custom(...values);
    }
  }
}

const getSchemaValue: SchemaFunction = (schema, item, fields) => {
  Object.keys(schema).forEach(fieldName => {
    const activeField = schema[fieldName];

    if (isString(activeField) && fields.indexOf(fieldName) === -1) {
      schema[fieldName] = getObjDeepProp(activeField)(item);
      fields.push(fieldName);
    } else if (isSchemeToolsObject(activeField)) {
      schema[fieldName] = schemaToolGenerator(activeField, item);
    } else if (isObject(activeField)) {
      getSchemaValue(activeField, item, fields);
    }

  });

  fields.length = 0;
  return schema;
};

export default getSchemaValue;