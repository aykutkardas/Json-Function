import { isArrayOfObject, isObject, isString } from "./type-check";
import getObjDeepProp from "./utils/get-obj-deep-prop";
import { where } from "./";

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

  return data.map(item => {
    const [otherDataItem] = where(
      otherData,
      { [otherDataFieldName]: getObjDeepProp(dataFieldName)(item) },
      { deep: true }
    );

    if (isObject(otherDataItem)) {
      return { ...item, ...otherDataItem };
    }

    return item;
  });

};

export default innerJoin;
