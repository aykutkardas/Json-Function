import JsonFunction from "../src/package";
import { describe, it, expect } from "vitest";

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

  it("Method Chaining Test with renamed fields.", () => {
    const result = JsonFunction.where({ completed: false })
      .orderBy("title", "DESC")
      .limit(2)
      .innerJoin(data2, "id", "id")
      .select(["user_id", "firstName", "title", "completed"])
      .schema({
        id: "user_id",
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

  it("Builds a query step by step.", () => {
    let query = JsonFunction.where({ completed: false });
    query = query.select(["title", "completed"]);
    query = query.orderBy("title", "DESC");
    query = query.limit(2);
    query = query.schema({
      todo: {
        title: "title",
        completed: "completed"
      }
    });
    const result = query.get(data);
    expect(result).to.deep.equal([
      {
        todo: { title: "quis ut nam facilis et officia qui", completed: false }
      },
      {
        todo: { title: "fugiat veniam minus", completed: false }
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

    expect(unCompleteTodoQuery).to.deep.equal([
      { type: "orderBy", args: ["title", "DESC", undefined] },
      { type: "where", args: [{ completed: false }, undefined] },
      { type: "limit", args: [2, 0] },
      { type: "select", args: [["title", "completed"], undefined] }
    ]);
    const expected = [
      {
        title: "quis ut nam facilis et officia qui",
        completed: false
      },
      {
        title: "fugiat veniam minus",
        completed: false
      }
    ];
    expect(result).to.deep.equal(expected);
    expect(result2).to.deep.equal(expected);
  });

  it("Still accepts queries in the pre-2.0 object format.", () => {
    const legacyQuery = {
      orderBy: ["title", "DESC"],
      where: [{ completed: false }],
      limit: [2, 0],
      select: ["title", "completed"],
      search: null,
      schema: null,
      innerJoin: null
    };
    expect(JsonFunction.get(data, { query: legacyQuery as any })).to.deep.equal([
      { title: "quis ut nam facilis et officia qui", completed: false },
      { title: "fugiat veniam minus", completed: false }
    ]);
  });

  it("Keeps the order of steps when a query is saved and reused.", () => {
    const rows = [{ a: 1 }, { a: 2 }];
    const query = JsonFunction.limit(1).where({ a: 2 }).getQuery();
    expect(JsonFunction.setQuery(query).get(rows)).to.deep.equal([]);
  });

  it("Applies every call when a method is used twice.", () => {
    const rows = [{ id: 1, a: 1 }, { id: 2, a: 1 }, { id: 2, a: 2 }];
    const result = JsonFunction.where({ a: 1 }).where({ id: 2 }).get(rows);
    expect(result).to.deep.equal([{ id: 2, a: 1 }]);
  });

  it("Does not leak an unfinished chain into other queries.", () => {
    JsonFunction.where({ a: 1 });
    expect(JsonFunction.get([{ a: 2 }])).to.deep.equal([{ a: 2 }]);
  });

  it("Lets a partial query be reused.", () => {
    const incomplete = JsonFunction.where({ completed: false });
    expect(incomplete.limit(1).get(data)).to.have.length(1);
    expect(incomplete.get(data)).to.have.length(3);
  });

  it("Never returns the input array itself.", () => {
    const rows = [{ a: 1 }];
    const result = JsonFunction.get(rows);
    expect(result).to.deep.equal(rows);
    expect(result).to.not.equal(rows);
  });

  it("Supports leftJoin in a chain.", () => {
    const result = JsonFunction.limit(2)
      .leftJoin([{ id: 1, firstName: "John" }], "id", "id")
      .select(["id", "firstName"])
      .get(data);
    expect(result).to.deep.equal([{ id: 1, firstName: "John" }, { id: 2 }]);
  });

  it("Search method chain test", () => {
    const result = JsonFunction.where({ completed: false })
      .search("ut", "title")
      .get(data);
    expect(result).to.deep.equal([
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
    ]);
  });
});
