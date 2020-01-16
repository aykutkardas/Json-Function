import JsonFunction from "../src";
import { expect } from "chai";
import "mocha";

const data = [
  {
    user_id: 1,
    id: 1,
    title: "delectus aut autem",
    completed: false
  },
  {
    user_id: 1,
    id: 2,
    title: "quis ut nam facilis et officia qui",
    completed: false
  },
  {
    user_id: 1,
    id: 3,
    title: "fugiat veniam minus",
    completed: false
  },
  {
    user_id: 1,
    id: 4,
    title: "et porro tempora",
    completed: true
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
  },
  {
    id: 3,
    firstName: "David"
  },
  {
    id: 4,
    firstName: "Noah"
  }
];

describe("JsonFunction Class", () => {
  it("Method Chaining Test.", () => {
    const result = JsonFunction.where({ completed: false })
      .orderBy("title", "DESC")
      .limit(2)
      .innerJoin(data2, "id", "id")
      .select(["firstName", "title", "completed"])
      .schema({
        firstName: "firstName",
        todo: {
          title: "title",
          completed: "completed"
        }
      })
      .get(data);
    expect(result).to.deep.equal([
      {
        firstName: "Mike",
        todo: { title: "quis ut nam facilis et officia qui", completed: false }
      },
      {
        firstName: "David",
        todo: { title: "fugiat veniam minus", completed: false }
      }
    ]);
  });

  it("Method Chaining Test with transform.", () => {
    const result = JsonFunction.where({ completed: false })
      .orderBy("title", "DESC")
      .limit(2)
      .innerJoin(data2, "id", "id")
      .transform() // user_id > userId
      .select(["userId", "firstName", "title", "completed"])
      .schema({
        id: "userId",
        firstName: "firstName",
        todo: {
          title: "title",
          completed: "completed"
        }
      })
      .get(data);
    expect(result).to.deep.equal([
      {
        id: 1,
        firstName: "Mike",
        todo: { title: "quis ut nam facilis et officia qui", completed: false }
      },
      {
        id: 1,
        firstName: "David",
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
      schema: null,
      innerJoin: null
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

  it("setQuery and getQuery test", () => {
    const unCompleteTodoQuery = JsonFunction.orderBy("title", "DESC")
      .where({ completed: false })
      .limit(2)
      .select(["title", "completed"])
      .getQuery();

    const result = JsonFunction.setQuery(unCompleteTodoQuery).get(data);

    const result2 = JsonFunction.get(data, { query: unCompleteTodoQuery });

    expect(unCompleteTodoQuery).to.deep.equal({
      orderBy: ["title", "DESC"],
      where: { completed: false },
      limit: [2, 0],
      select: ["title", "completed"],
      schema: null,
      innerJoin: null
    });
    expect(result).to.deep.equal([
      {
        title: "quis ut nam facilis et officia qui",
        completed: false
      },
      {
        title: "fugiat veniam minus",
        completed: false
      }
    ]);
    expect(result2).to.deep.equal([
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
