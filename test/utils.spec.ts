import getObjDeepProp from "../src/utils/get-obj-deep-prop";
import { expect } from "chai";
import "mocha";

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
    const result = getObjDeepProp(data[3], "education.isDone");
    expect(result).to.deep.equal(false);
  });
  it("Get-Object-Deep-Prop function found.", () => {
    const result = getObjDeepProp(data[0], "education.isDone");
    expect(result).to.deep.equal(true);
  });
});
