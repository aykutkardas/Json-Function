import { WhereToolObject } from "../../../interface/where";

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
