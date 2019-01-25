import { OrderBy, Where, Limit, Select, Schema, InnerJoin } from ".";

type Option = {
  orderBy: string[];
  where: object | object[];
  limit: number[];
  select: string | string[];
  schema: Object;
  innerJoin: [Object[], string, string];
};

type Config = {
  resetRecord?: boolean;
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
    schema: null,
    innerJoin: null,
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
      schema: null,
      innerJoin: null,
    };

    this.data = [];
    this.process = [];

    return this;
  }

  processManager() {
    const { option } = this;
    const { orderBy, where, limit, select, schema, innerJoin } = option;

    this.process.forEach(process => {
      switch (process) {
        case "orderBy":
          const [fieldName, order] = orderBy;
          this.data = OrderBy(this.data, fieldName, order);
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

        case "schema":
          this.data = Schema(this.data, schema);
          break;

        case "innerJoin":
          const [otherData, dataFieldName, otherDataFieldName] = innerJoin;
          console.log(otherData, dataFieldName, otherDataFieldName);
          this.data = InnerJoin(this.data, otherData, dataFieldName, otherDataFieldName);
          break;
      }
    });
  }

  orderBy(fieldName: string, order: string = "ASC") {
    this.option.orderBy = [fieldName, order];
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

  select(fields: string | string[]) {
    this.option.select = fields;
    this.process.push("select");
    return this;
  }

  innerJoin(otherData: Object[], dataFieldName: string, otherFiledName: string) {
    this.option.innerJoin = [otherData, dataFieldName, otherFiledName];
    this.process.push("innerJoin");
    return this;
  }

  get(data: Object[], config: Config = {}) {
    this.data = data;

    this.processManager();

    const result = [...this.data];

    const configs = { ...this.config, ...config };
    if (configs.resetRecord !== false) {
      this.reset();
    }

    return result;
  }
}

export default new JsonFunction();
