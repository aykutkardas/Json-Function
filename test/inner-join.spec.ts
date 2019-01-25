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
    firsName: "John"
  },
  {
    id: 2,
    firsName: "Mike"
  }
];

describe("InnerJoin Functions", () => {
  it("Get-Object-Deep-Prop function not found.", () => {
    const result = InnerJoin(data, data2, "userId", "id");
    expect(result).to.deep.equal([
      {
        userId: 1,
        firsName: "John",
        id: 1,
        title: "delectus aut autem",
        completed: false,
        education: {
          isDone: true
        }
      },
      {
        userId: 2,
        firsName: "Mike",
        id: 2,
        title: "quis ut nam facilis et officia qui",
        completed: false,
        education: {
          isDone: false
        }
      }
    ]);
  });
});
