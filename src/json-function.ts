import { OrderBy, Where, Limit, Select } from ".";
import select from "./select";

type Option = {
  orderBy: string[];
  where: object | object[];
  limit: number[];
  select: string | string[];
};

type Config = {
  resetRecord: boolean;
};

class JsonFunction {
  data: Object[] = [];
  option: Option = {
    orderBy: null,
    where: null,
    limit: null,
    select: null
  };

  reset() {
    this.option = {
      orderBy: null,
      where: null,
      limit: null,
      select: null
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

  select(fields: string | string[]) {
    this.option.select = fields;
    return this;
  }

  get(data: Object[], config?: Config) {
    this.data = data;

    const { option } = this;
    const { orderBy, where, limit, select } = option;

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

    const result = [...this.data];

    if (config) {
      if (config.resetRecord !== false) {
        this.reset();
      }
    }

    return result;
  }
}

export default new JsonFunction();
