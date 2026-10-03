import { isArray, isString, isArrayOfString } from "../../utils/type-check";
import getObjDeepProp from "../../utils/get-obj-deep-prop";

type SearchFunction = (
  data: Object[],
  key: any,
  fields: String | String[],
  options?: {
    caseSensitive?: Boolean;
  }
) => Object[];

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const search: SearchFunction = (data, key, fields, options) => {
  if (!isArray(data)) {
    return [];
  }

  let fieldsArr: String[];

  if (isString(fields)) {
    fieldsArr = [<String>fields];
  } else if (isArrayOfString(fields)) {
    fieldsArr = <String[]>fields;
  } else {
    return data;
  }

  let result = [];

  data.forEach((item) => {
    for (let index = 0; index < fieldsArr.length; index++) {
      const field = fieldsArr[index];
      const value = getObjDeepProp(field)(item);

      if (isString(key)) {
        // Missing fields and nested objects must not match by being
        // stringified into "undefined", "null" or "[object Object]".
        if (value === undefined || value === null || typeof value === "object") {
          continue;
        }

        const flag = options && options.caseSensitive === false ? "i" : "";
        const regex = new RegExp(escapeRegExp(key), flag);

        if (regex.test(String(value))) {
          result.push(item);
          break;
        }
      } else {
        if (key === value) {
          result.push(item);
          break;
        }
      }
    }
  });

  return result;
};

export default search;
