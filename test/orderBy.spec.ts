import { orderBy } from "../src/package";
import { describe, it, expect } from "vitest";

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
  it("Data 'default' sorting test using OrderBy function.", () => {
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

  it("Data 'ASC' sorting test using OrderBy function.", () => {
    const result = orderBy(data, "title", "ASC");
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

  it("Data 'DESC' sorting test using OrderBy function.", () => {
    const result = orderBy(data, "title", "DESC");
    expect(result).to.deep.equal([
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
      {
        userId: 1,
        id: 1,
        title: "delectus aut autem",
        completed: false,
        meta: { value: "a" },
      },
    ]);
  });

  it("Data 'DESC' sorting test with nested key using OrderBy function.", () => {
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

  it("Data 'ASC' sorting test with nested key using OrderBy function.", () => {
    const result = orderBy(data, "meta.value", "ASC", { deep: true });
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
    ]);
  });
});

describe("OrderBy immutability", () => {
  it("Does not mutate the input array.", () => {
    const input = [{ id: 3 }, { id: 1 }, { id: 2 }];
    const result = orderBy(input, "id");
    expect(result.map((item: any) => item.id)).to.deep.equal([1, 2, 3]);
    expect(input.map((item) => item.id)).to.deep.equal([3, 1, 2]);
    expect(result).to.not.equal(input);
  });
});
