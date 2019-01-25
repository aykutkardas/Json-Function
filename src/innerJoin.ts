import { isArrayOfObject, isObject } from "./type-check";
import getObjDeepProp from "./schema-tool/get-obj-deep-prop";
import { Where } from "./";

type InnerJoinFunction = (
  data: Object[],
  otherData: Object[],
  dataFieldName: string,
  otherDataFieldName: string
) => Object[];

const innerJoin: InnerJoinFunction = (
  data,
  otherData,
  dataFieldName,
  otherDataFieldName
) => {
  if (!isArrayOfObject(data)) {
    return [];
  }

  if (!isArrayOfObject(otherData)) {
    return data;
  }

  data = data.map(item => {
    const [otherDataItem] = Where(
      otherData,
      { [otherDataFieldName]: getObjDeepProp(item, dataFieldName) },
      { deep: true }
    );

    if (isObject(otherDataItem)) {
      return { ...item, ...otherDataItem };
    }

    return item;
  });

  return data;
};

export default innerJoin;
