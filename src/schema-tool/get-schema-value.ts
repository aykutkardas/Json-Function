import { SchemaToolObject } from "./";
import getObjDeepProp from "../utils/get-obj-deep-prop";

type RecursiveFunction = (
  schema: Object,
  item: Object,
  fields: string[]
) => Object;

const isSchemeToolsObject = (obj: SchemaToolObject) =>
  obj instanceof Object && obj.__schema__;

const recursive: RecursiveFunction = (schema, item, fields) => {
  Object.keys(schema).forEach(fieldName => {
    const activeField = schema[fieldName];

    if (typeof activeField === "string" && fields.indexOf(fieldName) === -1) {

      schema[fieldName] = getObjDeepProp(item, activeField);
      fields.push(fieldName);

    } else if (isSchemeToolsObject(activeField)) {

      const { __schema__ } = activeField;
      const { job, seperator = " " } = __schema__;
      let { values = [] } = __schema__;

      values = values.map((value: string) => getObjDeepProp(item, value));

      if (job === "join") {
        schema[fieldName] = values.join(seperator);
      }

    } else if (activeField instanceof Object) {
      recursive(activeField, item, fields);
    }
  });

  fields.length = 0;
  return schema;
};

export default recursive;
