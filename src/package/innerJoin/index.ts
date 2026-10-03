import { isArrayOfObject, isString, AnyObject } from "../../utils/type-check";
import getObjDeepProp from "../../utils/get-obj-deep-prop";

const join = (
  keepUnmatched: boolean,
  data: AnyObject[],
  otherData: AnyObject[],
  dataFieldName: string,
  otherDataFieldName: string
): AnyObject[] => {
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
  const index = new Map<unknown, AnyObject[]>();

  otherData.forEach(otherItem => {
    const key = getOtherDataField(otherItem);
    const matches = index.get(key);

    if (matches) {
      matches.push(otherItem);
    } else {
      index.set(key, [otherItem]);
    }
  });

  const result: AnyObject[] = [];

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
export function innerJoin<T extends object, U extends object>(
  data: T[],
  otherData: U[],
  dataFieldName: string,
  otherDataFieldName: string
): (T & U)[] {
  return join(false, data, otherData, dataFieldName, otherDataFieldName) as (T & U)[];
}

// Like SQL LEFT JOIN: items without a match are kept unchanged.
export function leftJoin<T extends object, U extends object>(
  data: T[],
  otherData: U[],
  dataFieldName: string,
  otherDataFieldName: string
): (T & Partial<U>)[] {
  return join(true, data, otherData, dataFieldName, otherDataFieldName) as (T & Partial<U>)[];
}

export default innerJoin;
