interface WhereToolObject {
  lt: (input: number) => (value: any) => boolean,
  lte: (input: number) => (value: any) => boolean,
  gt: (input: number) => (value: any) => boolean,
  gte: (input: number) => (value: any) => boolean,
  eq: (input: any) => (value: any) => boolean,
  ne: (input: any) => (value: any) => boolean,
  in: (input: any) => (value: any) => boolean,
  nin: (input: any) => (value: any) => boolean,
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
