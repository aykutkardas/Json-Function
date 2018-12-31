import { Select as select } from "../src";
import { expect } from "chai";
import "mocha";

const data = [
  {
    userId: 1,
    id: 1,
    title: "delectus aut autem",
    completed: false
  },
  {
    userId: 1,
    id: 2,
    title: "quis ut nam facilis et officia qui",
    completed: false
  },
  {
    userId: 1,
    id: 3,
    title: "fugiat veniam minus",
    completed: false
  },
  {
    userId: 1,
    id: 4,
    title: "et porro tempora",
    completed: true
  }
];

describe("Select Function", () => {
  it("[Single Parametre] Using the Selection function, test the data to be retrieved.", () => {
    const result = select(data, "title");
    expect(result).to.deep.equal([
      {
        title: "delectus aut autem"
      },
      {
        title: "quis ut nam facilis et officia qui"
      },
      {
        title: "fugiat veniam minus"
      },
      {
        title: "et porro tempora"
      }
    ]);
  });

  it("[Multiple Parametre] Using the Selection function, test the data to be retrieved.", () => {
    const result = select(data, ["title", "completed"]);
    expect(result).to.deep.equal([
      {
        title: "delectus aut autem",
        completed: false
      },
      {
        title: "quis ut nam facilis et officia qui",
        completed: false
      },
      {
        title: "fugiat veniam minus",
        completed: false
      },
      {
        title: "et porro tempora",
        completed: true
      }
    ]);
  });
});
