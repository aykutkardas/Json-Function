import getObjDeepProp from "../src/utils/get-obj-deep-prop";
import cloneDeep from "../src/utils/clone-deep";
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

describe("Utils Functions", () => {
  it("Get-Object-Deep-Prop function not found.", () => {
    const result = getObjDeepProp("education.isDone")(data[3]);
    expect(result).to.deep.equal(undefined);
  });
  it("Get-Object-Deep-Prop function found.", () => {
    const result = getObjDeepProp("education.isDone")(data[0]);
    expect(result).to.deep.equal(true);
  });
});

describe("cloneDeep", () => {
  it("Copies nested objects and arrays without changing the source.", () => {
    const fn = () => 1;
    const source = { a: { b: [1, { c: 2 }] }, fn };
    const copy = cloneDeep(source);
    expect(copy).to.deep.equal(source);
    expect(copy.a).to.not.equal(source.a);
    expect(copy.a.b).to.not.equal(source.a.b);
    expect(copy.fn).to.equal(fn);
    expect(Object.keys(source)).to.deep.equal(["a", "fn"]);
  });

  it("Handles objects without a prototype.", () => {
    const source = Object.create(null);
    source.a = 1;
    expect(cloneDeep(source)).to.deep.equal({ a: 1 });
  });
});
