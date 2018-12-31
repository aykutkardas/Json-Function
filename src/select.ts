type SelectFunction = (data: Object[], columns: string | string[]) => Object[];

const select: SelectFunction = (data = [], columns = []) => {
  let columnsArr: string[];

  if (!Array.isArray(columns)) {
    columnsArr = typeof columns === "string" ? [columns] : [];
  } else {
    columnsArr = columns;
  }

  const result: Object[] = [];

  data.forEach((item: Object) => {
    const newItem: Object = {};
    let foundedColumnCounter = 0;

    columnsArr.forEach((column: string) => {
      Object.keys(item).forEach((itemColumn: string) => {
        if (column === itemColumn) {
          newItem[column] = item[column];
          foundedColumnCounter++;
        }
      });
    });

    if (foundedColumnCounter > 0) {
      result.push(newItem);
    }
  });

  return result;
};

export default select;
