import {
  orderBy as OrderBy,
  where as Where,
  limit as Limit,
  select as Select,
  search as Search,
  schema as Schema,
  transform as Transform,
  innerJoin as InnerJoin,
} from "..";

import { isObject } from "../../utils/type-check";

type Option = {
  orderBy: [string, string, Object?];
  where: object | object[];
  limit: number[];
  select: string | string[];
  search: [string, string | string[], Object?];
  schema: Object;
  innerJoin: [Object[], string, string];
};

type Config = {
  resetRecord?: boolean;
  query?: Option;
  [key: string]: any;
};

class JsonFunction {
  data: Object[] = [];
  process: string[] = [];

  option: Option = {
    orderBy: null,
    where: null,
    limit: null,
    select: null,
    search: null,
    schema: null,
    innerJoin: null,
  };

  config: Config = {
    resetRecord: true,
  };

  reset() {
    this.option = {
      orderBy: null,
      where: null,
      limit: null,
      select: null,
      search: null,
      schema: null,
      innerJoin: null,
    };

    this.data = [];
    this.process = [];

    return this;
  }

  processManager() {
    const { option } = this;
    const { orderBy, where, limit, select, search, schema, innerJoin } = option;

    this.process.forEach((process) => {
      switch (process) {
        case "orderBy":
          const [fieldName, order, config] = orderBy;
          this.data = OrderBy(this.data, fieldName, order, config);
          break;

        case "where":
          this.data = Where(this.data, where);
          break;

        case "limit":
          const [itemLimit, start] = limit;
          this.data = Limit(this.data, itemLimit, start);
          break;

        case "select":
          this.data = Select(this.data, select);
          break;

        case "search":
          const [key, fields, option] = search;
          this.data = Search(this.data, key, fields, option);
          break;

        case "schema":
          this.data = <Object[]>Schema(this.data, schema);
          break;

        case "transform":
          this.data = <Object[]>Transform(this.data);
          break;

        case "innerJoin":
          const [otherData, dataFieldName, otherDataFieldName] = innerJoin;
          this.data = InnerJoin(
            this.data,
            otherData,
            dataFieldName,
            otherDataFieldName
          );
          break;
      }
    });
  }

  orderBy(fieldName: string, order: string = "ASC", orderBy?) {
    this.option.orderBy = [fieldName, order];

    if (orderBy) {
      this.option.orderBy.push(orderBy);
    }

    this.process.push("orderBy");
    return this;
  }

  where(queries: Object | Object[]) {
    this.option.where = queries;
    this.process.push("where");
    return this;
  }

  limit(limit: number = 10, start: number = 0) {
    this.option.limit = [limit, start];
    this.process.push("limit");
    return this;
  }

  schema(schema: Object) {
    this.option.schema = schema;
    this.process.push("schema");
    return this;
  }

  transform() {
    this.process.push("transform");
    return this;
  }

  select(fields: string | string[]) {
    this.option.select = fields;
    this.process.push("select");
    return this;
  }

  search(key, fields: string | string[], option?) {
    this.option.search = [key, fields, option];
    this.process.push("search");
    return this;
  }

  innerJoin(
    otherData: Object[],
    dataFieldName: string,
    otherFiledName: string
  ) {
    this.option.innerJoin = [otherData, dataFieldName, otherFiledName];
    this.process.push("innerJoin");
    return this;
  }

  get(data: Object[], config: Config = {}) {
    this.data = data;

    const configs = { ...this.config, ...config };

    if (config.query) {
      this.setQuery(config.query);
    }

    this.processManager();

    const result = [...this.data];

    if (configs.resetRecord !== false) {
      this.reset();
    }

    return result;
  }

  getQuery() {
    const option = { ...this.option };
    this.reset();
    return option;
  }

  setQuery(query: Option) {
    if (!isObject(query)) {
      return this;
    }

    this.option = query;

    Object.keys(query).forEach((process) => {
      if (query[process]) {
        this.process.push(process);
      }
    });

    return this;
  }
}

export default new JsonFunction();
