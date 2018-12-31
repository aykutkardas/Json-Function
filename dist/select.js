var select = function (data, columns) {
    if (data === void 0) { data = []; }
    if (columns === void 0) { columns = []; }
    var columnsArr;
    if (!Array.isArray(columns)) {
        columnsArr = typeof columns === "string" ? [columns] : [];
    }
    else {
        columnsArr = columns;
    }
    var result = [];
    data.forEach(function (item) {
        var newItem = {};
        var foundedColumnCounter = 0;
        columnsArr.forEach(function (column) {
            Object.keys(item).forEach(function (itemColumn) {
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
//# sourceMappingURL=select.js.map