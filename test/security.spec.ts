import { describe, it, expect, afterEach } from "vitest";
import JsonFunction, { select, transform, schema } from "../src/package";

// Keys that come from data or user input must never change Object.prototype
// or the prototype of returned objects.
const hasOwn = (obj: object, key: string) => Object.prototype.hasOwnProperty.call(obj, key);

describe("Prototype pollution", () => {
  afterEach(() => {
    delete (Object.prototype as any).polluted;
  });

  it("select with deep paths does not write to Object.prototype.", () => {
    const rows = [JSON.parse('{"id":1,"__proto__":{"polluted":"yes"}}')];
    const result: any[] = select(rows, ["id", "__proto__.polluted"], { deep: true });
    expect(({} as any).polluted).to.equal(undefined);
    expect(Object.getPrototypeOf(result[0])).to.equal(Object.prototype);
    expect(hasOwn(result[0], "__proto__")).to.equal(true);
    expect(result[0]["__proto__"]).to.deep.equal({ polluted: "yes" });
  });

  it("select deep paths through constructor or prototype stay on the result.", () => {
    const rows = [{ constructor: { prototype: { x: 1 } } }];
    const result: any[] = select(rows, ["constructor.prototype.x"], { deep: true });
    expect(({} as any).x).to.equal(undefined);
    expect(result[0].constructor).to.deep.equal({ prototype: { x: 1 } });
  });

  it("select without deep keeps a __proto__ column as a plain key.", () => {
    const rows = [JSON.parse('{"__proto__":{"role":"admin"}}')];
    const result: any[] = select(rows, "__proto__");
    expect(result[0].role).to.equal(undefined);
    expect(hasOwn(result[0], "__proto__")).to.equal(true);
  });

  it("transform does not let a key that becomes __proto__ set the prototype.", () => {
    const row = JSON.parse('{"name":"a","____proto____":{"is_admin":true}}');
    const result: any = transform(row);
    expect(result.isAdmin).to.equal(undefined);
    expect(Object.getPrototypeOf(result)).to.equal(Object.prototype);
    expect(result["__proto__"]).to.deep.equal({ isAdmin: true });
  });

  it("schema loaded from JSON keeps a __proto__ field as a plain key.", () => {
    const definition = JSON.parse('{"id":"id","__proto__":"role"}');
    const result: any[] = schema([{ id: 1, role: "admin" }], definition);
    expect(Object.getPrototypeOf(result[0])).to.equal(Object.prototype);
    expect(hasOwn(result[0], "__proto__")).to.equal(true);
  });

  it("chains are protected too.", () => {
    const rows = [JSON.parse('{"id":1,"__proto__":{"polluted":"yes"}}')];
    JsonFunction.select(["__proto__.polluted"], { deep: true }).limit(1).get(rows);
    expect(({} as any).polluted).to.equal(undefined);
  });
});
