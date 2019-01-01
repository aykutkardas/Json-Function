"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var where = function where(data, queries) {
    if (data === void 0) {
        data = [];
    }
    if (queries === void 0) {
        queries = [];
    }
    var queriesArr;
    var matchingItems = [];
    var result = [];
    var indexes = [];
    if (!Array.isArray(queries)) {
        queriesArr = [queries];
    } else {
        queriesArr = queries;
    }
    queriesArr.forEach(function (query) {
        Object.keys(query).forEach(function (fieldName) {
            matchingItems = data.filter(function (item, index) {
                if (item[fieldName] === query[fieldName]) {
                    if (indexes.indexOf(index) === -1) {
                        indexes.push(index);
                        return true;
                    }
                }
            });
        });
        result = result.concat(matchingItems);
        matchingItems = [];
    });
    return result;
};
exports.default = where;