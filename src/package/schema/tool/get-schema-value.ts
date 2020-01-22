import { isString, isObject, isSchemeToolsObject } from "../../../utils/type-check";
import getObjDeepProp from "../../../utils/get-obj-deep-prop";
import { GetSchemaValueFunction } from '../../../interface/schema';
import schemaToolGenerator from "./schema-tool-generator";

const getSchemaValue: GetSchemaValueFunction = (schema, item) => {
  Object.keys(schema).forEach(fieldName => {
    const activeField = schema[fieldName];

    if (isString(activeField)) {
      schema[fieldName] = getObjDeepProp(activeField)(item);
    } else if (isSchemeToolsObject(activeField)) {
      schema[fieldName] = schemaToolGenerator(activeField, item);
    } else if (isObject(activeField)) {
      getSchemaValue(activeField, item);
    }
  });

  return schema;
};

export default getSchemaValue;
