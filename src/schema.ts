import SchemaTools from './schema-tool';
import getSchemaValue from './schema-tool/get-schema-value';

type SchemaFunction = (data: Object[], schema: Object | Function) => Object[];

const schema: SchemaFunction = (data = [], schema = {}) => {
  let schemaObj = schema;

  if (typeof schemaObj === 'function') {
    schemaObj = schemaObj(SchemaTools);
  }

  const result: Object[] = [];
  const fields: string[] = [];

  data.forEach(item => {
    const temp = JSON.parse(JSON.stringify(schemaObj));

    Object.keys(schemaObj).forEach(key => {
      if (!schemaObj[key].__schema__) {
        return false;
      }
      Object.keys(schemaObj[key].__schema__).forEach(subKey => {
        temp[key].__schema__[subKey] = schemaObj[key].__schema__[subKey];
      });
    });
    result.push(getSchemaValue(temp, item, fields));
  });

  return result;
};

export default schema;
