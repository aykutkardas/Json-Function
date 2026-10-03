import getObjDeepProp from "../../../utils/get-obj-deep-prop";
import { SchemaToolObject } from "./callback";
import { isFunction } from "../../../utils/type-check";

const schemaToolGenerator = (obj: SchemaToolObject, item: object): unknown => {
  const { __schema__ } = obj;
  const { job, separator = " ", values: paths = [] } = __schema__;

  const values = paths.map((path: string) => getObjDeepProp(path)(item));

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
