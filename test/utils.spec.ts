import getObjDeepProp from "../src/utils/get-obj-deep-prop.js";
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

describe("getObjDeepProp paths", () => {
  const item = { a: { b: { c: { d: 4 } }, zero: 0 }, flag: false, list: [10, 20] };

  it("Reads paths of any depth.", () => {
    expect(getObjDeepProp("flag")(item)).to.equal(false);
    expect(getObjDeepProp("a.zero")(item)).to.equal(0);
    expect(getObjDeepProp("a.b.c")(item)).to.deep.equal({ d: 4 });
    expect(getObjDeepProp("a.b.c.d")(item)).to.equal(4);
    expect(getObjDeepProp("list.1")(item)).to.equal(20);
  });

  it("Returns undefined for missing segments at any depth.", () => {
    expect(getObjDeepProp("missing")(item)).to.equal(undefined);
    expect(getObjDeepProp("missing.x")(item)).to.equal(undefined);
    expect(getObjDeepProp("a.missing.x.y")(item)).to.equal(undefined);
    expect(getObjDeepProp("a.b")(null)).to.equal(undefined);
    expect(getObjDeepProp("a.b.c")(undefined)).to.equal(undefined);
  });

  it("Returns the same getter for the same path.", () => {
    expect(getObjDeepProp("a.b")).to.equal(getObjDeepProp("a.b"));
  });
});
