import { isArray, isString, isDefined } from "./type-check";

type SelectFunction = (data: Object[], columns: string | string[]) => Object[];

const select: SelectFunction = (data, columns) => {
  if (!isArray(data)) {
    return [];
  }

  let columnsArr: string[];

  if (isString(columns)) {
    columnsArr = [<string>columns];
  } else if (isArray(columns)) {
    columnsArr = <string[]>columns;
  } else {
    return data;
  }

  return data.map(item => {
    const newItem = {};
    columnsArr.forEach(column => {
      if (isDefined(item[column])) {
        newItem[column] = item[column];
      }
    });
    return newItem;
  });
};

export default select;
