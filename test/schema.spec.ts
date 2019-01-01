import { Schema as schema } from "../src";
import { expect } from "chai";
import "mocha";

const data = [
  {
    id: 0,
    user: {
      firstname: 'John',
      lastname: 'Doe'
    },
    title: 'Book Name'
  }
];

describe("Schema Function", () => {
  it("Rearrange data test using the schema function.", () => {
    const result = schema(data, {
        "title": "book.title",
        "id": "book.id",
        "views": "book.views",
        "user.firstname": "firstname",
        "user.lastname": "lastname",
      });

      expect(result).to.deep.equal([
        {
          firstname: 'John',
          lastname: 'Doe',
          book: {
            id: 0,
            title: 'Book Name',
            views: undefined
          },
        }
    ]);
  });
});
