import { isString, isObject, isSchemeToolsObject, AnyObject } from "../../../utils/type-check";
import getObjDeepProp from "../../../utils/get-obj-deep-prop";
import schemaToolGenerator from "./schema-tool-generator";
import { SchemaToolObject } from "./callback";

const getSchemaValue = (schema: AnyObject, item: AnyObject): AnyObject => {
  Object.keys(schema).forEach(fieldName => {
    const activeField = schema[fieldName];

    if (isString(activeField)) {
      schema[fieldName] = getObjDeepProp(activeField)(item);
    } else if (isSchemeToolsObject(activeField)) {
      schema[fieldName] = schemaToolGenerator(activeField as SchemaToolObject, item);
    } else if (isObject(activeField)) {
      getSchemaValue(activeField, item);
    }
  });

  return schema;
};

export default getSchemaValue;
