import { isArray, isString, isArrayOfString, isNumber } from "../../utils/type-check";
import getObjDeepProp from "../../utils/get-obj-deep-prop";

type SearchFunction = (
  data: Object[],
  key: any,
  fields: String | String[],
  options?: {
    caseSensitive?: Boolean,
  }
) => Object[];

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

  data.forEach(item => {
    let fieldCount = 0;

    fieldsArr.forEach(field => {
      if (fieldCount > 0) {
        return;
      }

      const value = getObjDeepProp(field)(item);

      if (isString(key)) {
        let flag = "g"; 

        if (options && !options.caseSensitive) {
          flag += "i";
        } 

        const regex = new RegExp(key, flag);

        if (regex.exec(value)) {
          result.push(item);
          fieldCount++;
        }
      } else {
        if (key === value) {
          result.push(item);
          fieldCount++;
        }
      }
    });

    fieldCount = 0;
  });


  return result;
}

export default search;
