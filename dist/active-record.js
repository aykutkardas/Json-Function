import { OrderBy, Where, Limit, Select } from "./";
var ActiveRecord = /** @class */ (function () {
    function ActiveRecord() {
        this.data = [];
        this.option = {
            orderBy: null,
            where: null,
            limit: null,
            select: null
        };
    }
    ActiveRecord.prototype.reset = function () {
        this.option = {
            orderBy: null,
            where: null,
            limit: null,
            select: null
        };
        this.data = [];
        return this;
    };
    ActiveRecord.prototype.orderBy = function (fieldName, order) {
        if (order === void 0) { order = "ASC"; }
        this.option.orderBy = [fieldName, order];
        return this;
    };
    ActiveRecord.prototype.where = function (queries) {
        this.option.where = queries;
        return this;
    };
    ActiveRecord.prototype.limit = function (limit, start) {
        if (limit === void 0) { limit = 10; }
        if (start === void 0) { start = 0; }
        this.option.limit = [limit, start];
        return this;
    };
    ActiveRecord.prototype.select = function (fields) {
        this.option.select = fields;
        return this;
    };
    ActiveRecord.prototype.get = function (data, config) {
        this.data = data;
        var option = this.option;
        var orderBy = option.orderBy, where = option.where, limit = option.limit, select = option.select;
        if (orderBy) {
            var fieldName = orderBy[0], order = orderBy[1];
            this.data = OrderBy(this.data, fieldName, order);
        }
        if (where) {
            this.data = Where(this.data, where);
        }
        if (limit) {
            var itemLimit = limit[0], start = limit[1];
            this.data = Limit(this.data, itemLimit, start);
        }
        if (select) {
            this.data = Select(this.data, select);
        }
        var result = this.data.slice();
        if (config) {
            if (config.resetRecord === true) {
                this.reset();
            }
        }
        return result;
    };
    return ActiveRecord;
}());
export default new ActiveRecord();
//# sourceMappingURL=active-record.js.map