import { toArray } from "../src";
import { expect } from "chai";
import "mocha";

const data = {
  'SpahhfW88GEcnVEXBkSB': {
    name: 'John'
  },
  'kDdjXxZWZwzKfYOyLUkE': {
    name: 'Mike'
  },
  'yPND1ItYbQXgoBXIAsz8': {
    name: 'Dan'
  }
};

describe("toArray Function", () => {
  it("Object to Array with default key", () => {
    const result = toArray(data);
    expect(result).to.deep.equal([
      {
        uid: 'SpahhfW88GEcnVEXBkSB',
        name: 'John'
      },
      {
        uid: 'kDdjXxZWZwzKfYOyLUkE',
        name: 'Mike'
      },
      {
        uid:  'yPND1ItYbQXgoBXIAsz8',
        name: 'Dan'
      }
    ]);
  });

  it("Object to Array with custom key", () => {
    const result = toArray(data, { key: '_id_'});
    expect(result).to.deep.equal([
      {
        _id_: 'SpahhfW88GEcnVEXBkSB',
        name: 'John'
      },
      {
        _id_: 'kDdjXxZWZwzKfYOyLUkE',
        name: 'Mike'
      },
      {
        _id_:  'yPND1ItYbQXgoBXIAsz8',
        name: 'Dan'
      }
    ]);
  });
});
