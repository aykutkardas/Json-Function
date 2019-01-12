import { isArray, isString, isDefined } from "./type-check";

type SelectFunction = (data: Object[], columns) => Object[];

const select: SelectFunction = (data, columns) => {
  if (!isArray(data)) {
    return [];
  }

  let columnsArr: string[] = [];

  if (isString(columns)) {
    columnsArr = [columns];
  } else if (isArray(columns)) {
    columnsArr = columns;
  } else {
    return data;
  }

  data = data.map(item => {
    const newItem = {};
    columnsArr.forEach(column => {
      if (isDefined(item[column])) {
        newItem[column] = item[column];
      }
    });
    return newItem;
  });
  
  return data;
};

export default select;
