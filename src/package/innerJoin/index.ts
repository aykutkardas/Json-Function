import { isArrayOfObject, isString } from "../../utils/type-check";
import getObjDeepProp from "../../utils/get-obj-deep-prop";

type JoinFunction = (
  data: Object[],
  otherData: Object[],
  dataFieldName: string,
  otherDataFieldName: string
) => Object[];

const join = (keepUnmatched: boolean): JoinFunction => (
  data,
  otherData,
  dataFieldName,
  otherDataFieldName
) => {
  if (!isArrayOfObject(data)) {
    return [];
  }

  if (!isArrayOfObject(otherData)) {
    return keepUnmatched ? data : [];
  }

  if (!isString(dataFieldName) || !isString(otherDataFieldName)) {
    return data;
  }

  const getDataField = getObjDeepProp(dataFieldName);
  const getOtherDataField = getObjDeepProp(otherDataFieldName);
  const index = new Map<any, Object[]>();

  otherData.forEach(otherItem => {
    const key = getOtherDataField(otherItem);
    const matches = index.get(key);

    if (matches) {
      matches.push(otherItem);
    } else {
      index.set(key, [otherItem]);
    }
  });

  const result: Object[] = [];

  data.forEach(item => {
    const matches = index.get(getDataField(item));

    if (matches) {
      matches.forEach(otherItem => result.push({ ...item, ...otherItem }));
    } else if (keepUnmatched) {
      result.push(item);
    }
  });

  return result;
};

// Like SQL INNER JOIN: only items with at least one match are returned, once
// per match.
export const innerJoin = join(false);

// Like SQL LEFT JOIN: items without a match are kept unchanged.
export const leftJoin = join(true);

export default innerJoin;
