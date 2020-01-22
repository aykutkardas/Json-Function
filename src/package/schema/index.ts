import { isFunction, isObject, isArrayOfObject } from "utils/type-check";
import SchemaTools from "./tool/callback";
import getSchemaValue from "./tool/get-schema-value";
import { cloneDeep } from "utils/index";

import { SchemaFunction } from 'interface/schema';

const schema: SchemaFunction = (data, schema = {}) => {
  if (!isArrayOfObject(data) && !isObject(data)) {
    return null;
  }

  let schemaObj: Object;
  if (isObject(schema)) {
    schemaObj = schema;
  } else if (isFunction(schema)) {
    schemaObj = (<Function>schema)(SchemaTools);
  } else {
    return data;
  }

  if (isArrayOfObject(data)) {
    return (<Object[]>data).map(item => {
      const temp = cloneDeep(schemaObj);
      return getSchemaValue(temp, item);
    });
  } else if (isObject(data)) {
    const temp = cloneDeep(schemaObj);
    return getSchemaValue(temp, data);
  }
};

export default schema;
