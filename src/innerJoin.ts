import { isArrayOfObject, isObject, isString } from "./type-check";
import getObjDeepProp from "./utils/get-obj-deep-prop";
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

  if (!isString(dataFieldName) || !isString(otherDataFieldName)) {
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
