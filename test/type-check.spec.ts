import { utils } from "../src/package";
import { expect } from "chai";
import "mocha";

describe("TypeCheck isString Test", () => {
  it("Give string value", () => {
    expect(utils.isString("test")).to.equal(true);
  });
  it("Give without string value", () => {
    expect(utils.isString(null)).to.equal(false);
  });
});

describe("TypeCheck isNumber Test", () => {
  it("Give integer value", () => {
    expect(utils.isNumber(1)).to.equal(true);
  });
  it("Give float value", () => {
    expect(utils.isNumber(1.4)).to.equal(true);
  });
  it("Give NaN value", () => {
    expect(utils.isNumber(NaN)).to.equal(false);
  });
  it("Give without integer value", () => {
    expect(utils.isNumber(null)).to.equal(false);
  });
});

describe("TypeCheck isArray Test", () => {
  it("Give array value", () => {
    expect(utils.isArray([])).to.equal(true);
  });
  it("Give without array value", () => {
    expect(utils.isArray(null)).to.equal(false);
  });
});

describe("TypeCheck isArrayOfString Test", () => {
  it("Give empy array value", () => {
    expect(utils.isArrayOfString([])).to.equal(true);
  });
  it("Give array of string value", () => {
    expect(utils.isArrayOfString(["a", "b"])).to.equal(true);
  });
  it("Give array of any value", () => {
    expect(utils.isArrayOfString(["a", 1])).to.equal(false);
  });
  it("Give null value", () => {
    expect(utils.isArrayOfString(null)).to.equal(false);
  });
});

describe("TypeCheck isArrayOfObject Test", () => {
  it("Give empy array value", () => {
    expect(utils.isArrayOfObject([])).to.equal(true);
  });
  it("Give array of object value", () => {
    expect(utils.isArrayOfObject([{}, {}])).to.equal(true);
  });
  it("Give array of any value", () => {
    expect(utils.isArrayOfObject([{}, "a"])).to.equal(false);
  });
  it("Give null value", () => {
    expect(utils.isArrayOfObject(null)).to.equal(false);
  });
});

describe("TypeCheck isDefined Test", () => {
  it("Give any value", () => {
    expect(utils.isDefined(1)).to.equal(true);
  });
  it("Give undefined value", () => {
    expect(utils.isDefined(undefined)).to.equal(false);
  });
});

describe("TypeCheck isFunction Test", () => {
  it("Give function value", () => {
    expect(utils.isFunction(function() {})).to.equal(true);
  });
  it("Give without function value", () => {
    expect(utils.isFunction(3)).to.equal(false);
  });
});

describe("TypeCheck isObject Test", () => {
  it("Give object value", () => {
    expect(utils.isObject({})).to.equal(true);
  });
  it("Give without object value", () => {
    expect(utils.isObject(true)).to.equal(false);
  });
});

describe("TypeCheck isOneOf Test", () => {
  it("Give one of value", () => {
    expect(utils.isOneOf("a", ["a", "b"])).to.equal(true);
  });
  it("Give without one of value", () => {
    expect(utils.isOneOf("a", [1, 2])).to.equal(false);
  });
  it("Give null options", () => {
    expect(utils.isOneOf("a", null)).to.equal(false);
  });
});

describe("TypeCheck isSchemeToolsObject Test", () => {
  it("Give schema object value", () => {
    expect(utils.isSchemeToolsObject({ __schema__: {} })).to.equal(true);
  });
  it("Give without schema object value", () => {
    expect(utils.isSchemeToolsObject(1)).to.equal(false);
  });
});
