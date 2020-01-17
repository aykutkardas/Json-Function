interface WhereToolObject {
  lt: (input: number) => (value: any) => boolean,
  lte: (value: number) => (value: any) => boolean,
  gt: (value: number) => (value: any) => boolean,
  gte: (value: number) => (value: any) => boolean,
  eq: (value: any) => (value: any) => boolean,
  ne: (value: any) => (value: any) => boolean,
  in: (value: any) => (value: any) => boolean,
  nin: (value: any) => (value: any) => boolean,
  between: (min: number, max: number) => (value: any) => boolean,
}


const whereToolObject: WhereToolObject = {
  lt: (input) => (value) => value < input,
  lte: (input) => (value) => value <= input,
  gt: (input) => (value) => value > input,
  gte: (input) => (value) => value >= input,
  eq: (input) => (value) => value == input,
  ne: (input) => (value) => value != input,
  in: (input) => (value) => value.includes(input),
  nin: (input) => (value) => !value.includes(input),
  between: (min, max) => (value) => value >= min && value <= max,
};

export default whereToolObject;
