import ActiveRecord from "../src";
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

describe("ActiveRecord Class", () => {
  it("Method Chaining Test.", () => {
    const result = ActiveRecord.where({ completed: false })
      .select(["title", "completed"])
      .orderBy("title", "DESC")
      .limit(2)
      .get(data);
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
  });
  it("Method Standard Use Test", () => {
    ActiveRecord.where({ completed: false });
    ActiveRecord.select(["title", "completed"]);
    ActiveRecord.orderBy("title", "DESC");
    ActiveRecord.limit(2);
    const result = ActiveRecord.get(data);
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
  });

  it("Config test --resetRecord", () => {
    ActiveRecord.where({ completed: false });
    ActiveRecord.select(["title", "completed"]);
    ActiveRecord.orderBy("title", "DESC");
    ActiveRecord.limit(2);
    ActiveRecord.get(data, { resetRecord: true });

    const option = ActiveRecord.option;
    const classData = ActiveRecord.data;
    expect(option).to.deep.equal({
      orderBy: null,
      where: null,
      limit: null,
      select: null
    });
    expect(classData).to.deep.equal([]);
  });
});
