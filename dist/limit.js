var limit = function (data, limit, start) {
    if (data === void 0) { data = []; }
    if (limit === void 0) { limit = 10; }
    if (start === void 0) { start = 0; }
    if (!Array.isArray(data)) {
        return [];
    }
    return data.slice(start, limit + start);
};
export default limit;
//# sourceMappingURL=limit.js.map