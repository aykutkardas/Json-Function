import { innerJoin, leftJoin } from "../src/package/index.js";
import { describe, it, expect } from "vitest";

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

describe("innerJoin Functions", () => {
  it("A successful match test.", () => {
    const result = innerJoin(data, data2, "userId", "id");
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
    const result = innerJoin(data, data2, "userId", "userId");
    expect(result).to.deep.equal([]);
  });
  it("Drops items without a match.", () => {
    const result = innerJoin(data, [{ id: 2, firstName: "Mike" }], "userId", "id");
    expect(result.map((item: any) => item.firstName)).to.deep.equal(["Mike"]);
  });
  it("Returns one row per match.", () => {
    const pets = [
      { ownerId: 1, pet: "cat" },
      { ownerId: 1, pet: "dog" },
    ];
    const result = innerJoin(data, pets, "userId", "ownerId");
    expect(result.map((item: any) => [item.id, item.pet])).to.deep.equal([
      [1, "cat"],
      [1, "dog"],
    ]);
  });
});

describe("leftJoin Functions", () => {
  it("Keeps items without a match unchanged.", () => {
    const result = leftJoin(data, [{ id: 2, firstName: "Mike" }], "userId", "id");
    expect(result).to.deep.equal([data[0], { ...data[1], firstName: "Mike" }]);
  });
  it("An unsuccessful match test.", () => {
    const result = leftJoin(data, data2, "userId", "userId");
    expect(result).to.deep.equal(data);
  });
});
