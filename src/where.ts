type WhereFunction = (data: Object[], queries: Object | Object[]) => Object[];

const where: WhereFunction = (data = [], queries = []) => {
  let queriesArr: Object[];
  let matchingItems: Object[] = [];
  let result: Object[] = [];
  let indexes = [];

  if (!Array.isArray(queries)) {
    queriesArr = [queries];
  } else {
    queriesArr = queries;
  }

  queriesArr.forEach(query => {
    Object.keys(query).forEach(fieldName => {
      matchingItems = data.filter((item, index) => {
        if (item[fieldName] === query[fieldName]) {
          if (indexes.indexOf(index) === -1) {
            indexes.push(index);
            return true;
          }
        }
      });
    });

    result = [...result, ...matchingItems];
    matchingItems = [];
  });

  return result;
};

export default where;
