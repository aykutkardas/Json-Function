"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var limit = function limit(data, _limit, start) {
    if (data === void 0) {
        data = [];
    }
    if (_limit === void 0) {
        _limit = 10;
    }
    if (start === void 0) {
        start = 0;
    }
    if (!Array.isArray(data)) {
        return [];
    }
    return data.slice(start, _limit + start);
};
exports.default = limit;