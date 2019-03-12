import getObjDeepProp from "../utils/get-obj-deep-prop";
import { SchemaToolObject } from "./";

const schemaToolGenerator = (obj: SchemaToolObject, item: Object) => {
  const { __schema__ } = obj;
  const { job, separator = " " } = __schema__;
  let { values = [] } = __schema__;

  values = values.map((value: string) => getObjDeepProp(value)(item));

  if (job === "join") {
    return values.join(separator);
  }

  if (job === "custom") {
    const { custom } = __schema__;
    if (typeof custom === "function") {
      return custom(...values);
    }
  }
};

export default schemaToolGenerator;
