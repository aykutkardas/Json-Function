import { orderBy } from "../src/package";
import { expect } from "chai";
import "mocha";

const data = [
  {
    userId: 1,
    id: 1,
    title: "delectus aut autem",
    completed: false,
    meta: { value: "a" },
  },
  {
    userId: 1,
    id: 2,
    title: "quis ut nam facilis et officia qui",
    completed: false,
    meta: { value: "b" },
  },
  {
    userId: 1,
    id: 3,
    title: "fugiat veniam minus",
    completed: false,
    meta: { value: "c" },
  },
  {
    userId: 1,
    id: 4,
    title: "et porro tempora",
    completed: true,
    meta: { value: "d" },
  },
];

describe("OrdeyBy Function", () => {
  it("Data sorting test using OrderBy function.", () => {
    const result = orderBy(data, "title");
    expect(result).to.deep.equal([
      {
        userId: 1,
        id: 1,
        title: "delectus aut autem",
        completed: false,
        meta: { value: "a" },
      },
      {
        userId: 1,
        id: 4,
        title: "et porro tempora",
        completed: true,
        meta: { value: "d" },
      },
      {
        userId: 1,
        id: 3,
        title: "fugiat veniam minus",
        completed: false,
        meta: { value: "c" },
      },
      {
        userId: 1,
        id: 2,
        title: "quis ut nam facilis et officia qui",
        completed: false,
        meta: { value: "b" },
      },
    ]);
  });

  it("Data sorting test with nested key using OrderBy function.", () => {
    const result = orderBy(data, "meta.value", "DESC", { deep: true });
    expect(result).to.deep.equal([
      {
        userId: 1,
        id: 4,
        title: "et porro tempora",
        completed: true,
        meta: { value: "d" },
      },
      {
        userId: 1,
        id: 3,
        title: "fugiat veniam minus",
        completed: false,
        meta: { value: "c" },
      },
      {
        userId: 1,
        id: 2,
        title: "quis ut nam facilis et officia qui",
        completed: false,
        meta: { value: "b" },
      },
      {
        userId: 1,
        id: 1,
        title: "delectus aut autem",
        completed: false,
        meta: { value: "a" },
      },
    ]);
  });
});
