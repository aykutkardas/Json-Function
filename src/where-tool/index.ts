type WhereToolMethod = {
  value: any;
  type: "<" | "<=" | ">" | ">=" | "==" | "!=" | "in" | "nin" | "btw";
};

interface WhereToolObject {
  lt: (value: number) => WhereToolMethod,
  lte: (value: number) => WhereToolMethod,
  gt: (value: number) => WhereToolMethod,
  gte: (value: number) => WhereToolMethod,
  eq: (value: any) => WhereToolMethod,
  ne: (value: any) => WhereToolMethod,
  in: (value: any) => WhereToolMethod,
  nin: (value: any) => WhereToolMethod,
  between: (min: number, max: number) => WhereToolMethod,
}


const whereToolObject: WhereToolObject = {
  lt: (value) => ({ value, type: "<" }),
  lte: (value) => ({ value, type: "<=" }),
  gt: (value) => ({ value, type: ">" }),
  gte: (value) => ({ value, type: ">=" }),
  eq: (value) => ({ value, type: "==" }),
  ne: (value) => ({ value, type: "!=" }),
  in: (value) => ({ value, type: "in" }),
  nin: (value) => ({ value, type: "nin" }),
  between: (min, max) => ({ value: [min, max], type: "btw" })
};

export default whereToolObject;
