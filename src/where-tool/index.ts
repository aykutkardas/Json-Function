type WhereToolObject = {
  value: any;
  type: string;
};

export default {
  lt: (value: number): WhereToolObject => ({
    value,
    type: "<"
  }),
  lte: (value: number): WhereToolObject => ({
    value,
    type: "<="
  }),
  gt: (value: number): WhereToolObject => ({
    value,
    type: ">"
  }),
  gte: (value: number): WhereToolObject => ({
    value,
    type: ">="
  }),
  eq: (value: any): WhereToolObject => ({
    value,
    type: "=="
  }),
  ne: (value: any): WhereToolObject => ({
    value,
    type: "!="
  }),
  in: (value: any): WhereToolObject => ({
    value,
    type: "includes"
  }),
  nin: (value: any): WhereToolObject => ({
    value,
    type: "!includes"
  }),
  between: (...value: number[]): WhereToolObject => ({
    value,
    type: "between"
  })
};
