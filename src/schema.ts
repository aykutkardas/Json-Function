type SchemaFunction = (data: Object[], schema: Object) => Object[];

type RecursiveFunction = (
  schema: Object,
  item: Object,
  fields: string[]
) => Object;

type GetObjDeepPropFunction = (
  obj: Object,
  props: string,
  defaultValue?: any
) => any;

const getObjDeepProp: GetObjDeepPropFunction = (obj, props, defaultValue) => {
  if (!obj) return false;
  if (typeof obj !== "object") return false;
  if (!props) return obj;
  if (typeof props !== "string") return false;

  const propsArr = props.split(".");
  let rootObj: any = obj;

  propsArr.forEach(prop => {
    if (
      typeof rootObj[prop] !== "undefined" ||
      rootObj[prop] !== null ||
      !isNaN(rootObj[prop])
    ) {
      rootObj = rootObj[prop];
    } else {
      rootObj = false;
    }
  });

  return rootObj !== false ? rootObj : defaultValue ? defaultValue : false;
};

const recursive: RecursiveFunction = (schema, item, fields) => {
  Object.keys(schema).forEach(fieldName => {
    if (
      typeof schema[fieldName] === "string" &&
      fields.indexOf(fieldName) === -1
    ) {
      schema[fieldName] = getObjDeepProp(item, schema[fieldName]);
      fields.push(fieldName);
    } else if (schema[fieldName] instanceof Object) {
      recursive(schema[fieldName], item, fields);
    }
  });

  fields.length = 0;
  return schema;
};

const schema: SchemaFunction = (data = [], schema = {}) => {
  const result: Object[] = [];
  const fields: string[] = [];

  data.forEach((item, index) => {
    let temp = JSON.stringify(schema);
    result.push(recursive(JSON.parse(temp), item, fields));
  });

  return result;
};

export default schema;
