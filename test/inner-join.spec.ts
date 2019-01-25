import { InnerJoin } from "../src";
import { expect } from "chai";
import "mocha";

const data = [
  {
    userId: 1,
    id: 1,
    title: "delectus aut autem",
    completed: false,
    education: {
      isDone: true
    }
  },
  {
    userId: 2,
    id: 2,
    title: "quis ut nam facilis et officia qui",
    completed: false,
    education: {
      isDone: false
    }
  }
];

const data2 = [
  {
    id: 1,
    firstName: "John"
  },
  {
    id: 2,
    firstName: "Mike"
  }
];

describe("InnerJoin Functions", () => {
  it("A successful match test.", () => {
    const result = InnerJoin(data, data2, "userId", "id");
    expect(result).to.deep.equal([
      {
        userId: 1,
        firstName: "John",
        id: 1,
        title: "delectus aut autem",
        completed: false,
        education: {
          isDone: true
        }
      },
      {
        userId: 2,
        firstName: "Mike",
        id: 2,
        title: "quis ut nam facilis et officia qui",
        completed: false,
        education: {
          isDone: false
        }
      }
    ]);
  });
  it("An unsuccessful match test.", () => {
    const result = InnerJoin(data, data2, "userId", "userId");
    expect(result).to.deep.equal(data);
  });
});
