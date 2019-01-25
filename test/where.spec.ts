import { Where as where } from "../src";
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
  },
  {
    userId: 2,
    id: 3,
    title: "fugiat veniam minus",
    completed: false,
    education: {
      isDone: false
    }
  },
  {
    userId: 1,
    id: 4,
    title: "et porro tempora",
    completed: true
  }
];

describe("Where function", () => {
  it("[Single Parametre] Data filtering test using Where function.", () => {
    const result = where(data, { completed: true });
    expect(result).to.deep.equal([
      {
        userId: 1,
        id: 4,
        title: "et porro tempora",
        completed: true
      }
    ]);
  });
  it("[Options deep=true] Data filtering test using Where function.", () => {
    const result = where(data, { "education.isDone": true }, { deep: true });
    expect(result).to.deep.equal([
      {
        userId: 1,
        id: 1,
        title: "delectus aut autem",
        completed: false,
        education: {
          isDone: true
        }
      }
    ]);
  });
  it("[Multiple Parametre] Data filtering test using Where function.", () => {
    const result = where(data, [{ completed: true }, { userId: 2 }]);
    expect(result).to.deep.equal([
      {
        userId: 1,
        id: 4,
        title: "et porro tempora",
        completed: true
      },
      {
        userId: 2,
        id: 2,
        title: "quis ut nam facilis et officia qui",
        completed: false,
        education: {
          isDone: false
        }
      },
      {
        userId: 2,
        id: 3,
        title: "fugiat veniam minus",
        completed: false,
        education: {
          isDone: false
        }
      }
    ]);
  });
});
