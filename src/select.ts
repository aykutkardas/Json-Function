import { isArray, isString, isDefined } from "./type-check";

type SelectFunction = (data: Object[], columns: string | string[]) => Object[];

const select: SelectFunction = (data, columns) => {
  if (!isArray(data)) {
    return [];
  }

  if (isString(columns)) {
    return data.map(item => {
      const newItem = {};
      const column = (<string>columns);
      if (isDefined(item[column])) {
        newItem[column] = item[column];
      }
      return newItem;
    });
  }

  if (isArray(columns)) {
    return data.map(item => {
      const newItem = {};
      (<string[]>columns).forEach(column => {
        if (isDefined(item[column])) {
          newItem[column] = item[column];
        }
      });
      return newItem;
    });
  }

  return data;
};

export default select;
