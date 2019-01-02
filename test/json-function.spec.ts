import JsonFunction from "../src";
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

describe("JsonFunction Class", () => {
  it("Method Chaining Test.", () => {
    const result = JsonFunction.where({ completed: false })
      .select(["title", "completed"])
      .orderBy("title", "DESC")
      .limit(2)
      .schema({
        todo: {
          title: "title",
          completed: "completed"
        }
      })
      .get(data);
    expect(result).to.deep.equal([
      {
        todo: { title: "quis ut nam facilis et officia qui", completed: false }
      },
      {
        todo: { title: "fugiat veniam minus", completed: false }
      }
    ]);
  });
  it("Method Standard Use Test", () => {
    JsonFunction.where({ completed: false });
    JsonFunction.select(["title", "completed"]);
    JsonFunction.orderBy("title", "DESC");
    JsonFunction.limit(2);
    JsonFunction.schema({
      todo: {
        title: "title",
        completed: "completed"
      }
    });
    const result = JsonFunction.get(data);
    expect(result).to.deep.equal([
      {
        todo: { title: "quis ut nam facilis et officia qui", completed: false }
      },
      {
        todo: { title: "fugiat veniam minus", completed: false }
      }
    ]);
  });

  it("Config test --resetRecord", () => {
    JsonFunction.where({ completed: false });
    JsonFunction.select(["title", "completed"]);
    JsonFunction.orderBy("title", "DESC");
    JsonFunction.limit(2);
    JsonFunction.get(data, { resetRecord: false });

    const option = JsonFunction.option;
    const classData = JsonFunction.data;
    expect(option).to.deep.equal({
      orderBy: ["title", "DESC"],
      where: { completed: false },
      limit: [2, 0],
      select: ["title", "completed"],
      schema: null
    });
    expect(classData).to.deep.equal([
      {
        title: "quis ut nam facilis et officia qui",
        completed: false
      },
      {
        title: "fugiat veniam minus",
        completed: false
      }
    ]);
  });
});
