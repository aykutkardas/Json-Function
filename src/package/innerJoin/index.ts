import { isArrayOfObject, isObject, isString } from "../../utils/type-check";
import getObjDeepProp from "../../utils/get-obj-deep-prop";

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

  const getDataField = getObjDeepProp(dataFieldName);
  const getOtherDataField = getObjDeepProp(otherDataFieldName);
  const temp = otherData.reduce((p, n) => p.set(getOtherDataField(n), n), new Map());

  return data.map(item => {
    const otherDataItem = temp.get(getDataField(item));

    if (isObject(otherDataItem)) {
      return { ...item, ...otherDataItem };
    }

    return item;
  });
};

export default innerJoin;
