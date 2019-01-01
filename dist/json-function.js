"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ = require("./");

var JsonFunction = /** @class */function () {
    function JsonFunction() {
        this.data = [];
        this.option = {
            orderBy: null,
            where: null,
            limit: null,
            select: null
        };
    }
    JsonFunction.prototype.reset = function () {
        this.option = {
            orderBy: null,
            where: null,
            limit: null,
            select: null
        };
        this.data = [];
        return this;
    };
    JsonFunction.prototype.orderBy = function (fieldName, order) {
        if (order === void 0) {
            order = "ASC";
        }
        this.option.orderBy = [fieldName, order];
        return this;
    };
    JsonFunction.prototype.where = function (queries) {
        this.option.where = queries;
        return this;
    };
    JsonFunction.prototype.limit = function (limit, start) {
        if (limit === void 0) {
            limit = 10;
        }
        if (start === void 0) {
            start = 0;
        }
        this.option.limit = [limit, start];
        return this;
    };
    JsonFunction.prototype.select = function (fields) {
        this.option.select = fields;
        return this;
    };
    JsonFunction.prototype.get = function (data, config) {
        this.data = data;
        var option = this.option;
        var orderBy = option.orderBy,
            where = option.where,
            limit = option.limit,
            select = option.select;
        if (orderBy) {
            var fieldName = orderBy[0],
                order = orderBy[1];
            this.data = (0, _.OrderBy)(this.data, fieldName, order);
        }
        if (where) {
            this.data = (0, _.Where)(this.data, where);
        }
        if (limit) {
            var itemLimit = limit[0],
                start = limit[1];
            this.data = (0, _.Limit)(this.data, itemLimit, start);
        }
        if (select) {
            this.data = (0, _.Select)(this.data, select);
        }
        var result = this.data.slice();
        if (config) {
            if (config.resetRecord !== false) {
                this.reset();
            }
        }
        return result;
    };
    return JsonFunction;
}();
exports.default = new JsonFunction();