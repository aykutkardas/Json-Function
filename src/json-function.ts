import { OrderBy, Where, Limit, Select, Schema } from ".";

type Option = {
  orderBy: string[];
  where: object | object[];
  limit: number[];
  select: string | string[];
  schema: Object;
};

type Config = {
  resetRecord?: boolean;
  [key: string]: any;
};

class JsonFunction {
  data: Object[] = [];
  option: Option = {
    orderBy: null,
    where: null,
    limit: null,
    select: null,
    schema: null
  };

  config: Config = {
    resetRecord: true
  };

  reset() {
    this.option = {
      orderBy: null,
      where: null,
      limit: null,
      select: null,
      schema: null
    };

    this.data = [];

    return this;
  }

  orderBy(fieldName: string, order: string = "ASC") {
    this.option.orderBy = [fieldName, order];
    return this;
  }

  where(queries: Object | Object[]) {
    this.option.where = queries;
    return this;
  }

  limit(limit: number = 10, start: number = 0) {
    this.option.limit = [limit, start];
    return this;
  }

  schema(schema: Object) {
    this.option.schema = schema;
    return this;
  }

  select(fields: string | string[]) {
    this.option.select = fields;
    return this;
  }

  get(data: Object[], config: Config = {}) {
    this.data = data;

    const { option } = this;
    const { orderBy, where, limit, select, schema } = option;

    if (orderBy) {
      const [fieldName, order] = orderBy;
      this.data = OrderBy(this.data, fieldName, order);
    }

    if (where) {
      this.data = Where(this.data, where);
    }

    if (limit) {
      const [itemLimit, start] = limit;
      this.data = Limit(this.data, itemLimit, start);
    }

    if (select) {
      this.data = Select(this.data, select);
    }

    if (schema) {
      this.data = Schema(this.data, schema);
    }

    const result = [...this.data];

    const configs = { ...this.config, ...config };
    if (configs.resetRecord !== false) {
      this.reset();
    }

    return result;
  }
}

export default new JsonFunction();
