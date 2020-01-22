import getObjDeepProp from "../../../utils/get-obj-deep-prop";
import { SchemaToolGenerator } from '../../../interface/schema';
import { isFunction } from "../../../utils/type-check";

const schemaToolGenerator: SchemaToolGenerator = (obj, item) => {
  const { __schema__ } = obj;
  const { job, separator = " " } = __schema__;
  let { values = [] } = __schema__;

  values = values.map((value: string) => getObjDeepProp(value)(item));

  if (job === "join") {
    return values.join(separator);
  }

  if (job === "custom") {
    const { custom } = __schema__;
    if (isFunction(custom)) {
      return custom(...values);
    }
  }
};

export default schemaToolGenerator;
