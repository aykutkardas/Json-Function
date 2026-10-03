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

// The key is matched as plain text. Passing it to RegExp unescaped let input
// such as "(" throw and patterns such as "(a+)+$" hang the process (ReDoS).
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
        let flag = "g";

        if (options && !options.caseSensitive) {
          flag += "i";
        }

        const regex = new RegExp(escapeRegExp(key), flag);

        if (regex.exec(value)) {
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
