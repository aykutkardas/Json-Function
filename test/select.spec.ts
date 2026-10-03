import { select } from "../src/package/index.js";
import { describe, it, expect } from "vitest";

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

describe("Select Function with deep paths", () => {
  const people = [
    { id: 1, user: { name: "John", address: { city: "Ankara" } }, tags: ["a"] },
    { id: 2, user: { name: "Mike" } },
  ];

  it("Builds nested objects for dotted paths.", () => {
    const result = select(people, ["id", "user.name", "user.address.city"], { deep: true });
    expect(result).to.deep.equal([
      { id: 1, user: { name: "John", address: { city: "Ankara" } } },
      { id: 2, user: { name: "Mike" } },
    ]);
  });

  it("Treats dotted paths as plain keys without the deep option.", () => {
    expect(select([{ "a.b": 1, a: { b: 2 } }], "a.b")).to.deep.equal([{ "a.b": 1 }]);
  });
});
