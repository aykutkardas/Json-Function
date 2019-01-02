import { Schema as schema } from "../src";
import { expect } from "chai";
import "mocha";

const data = [
  {
    id: 0,
    user: {
      firstname: "John",
      lastname: "Doe"
    },
    title: "Book Name"
  },
  {
    id: 1,
    user: {
      firstname: "Johnny",
      lastname: "Doe"
    },
    title: "Book Name 2"
  }
];

describe("Schema Function", () => {
  it("Rearrange data test using the schema function.", () => {
    const result = schema(data, {
      book: {
        id: "id",
        title: "title"
      },
      firstname: "user.firstname",
      lastname: "user.lastname"
    });

    expect(result).to.deep.equal([
      {
        firstname: "John",
        lastname: "Doe",
        book: {
          id: 0,
          title: "Book Name"
        }
      },
      {
        firstname: "Johnny",
        lastname: "Doe",
        book: {
          id: 1,
          title: "Book Name 2"
        }
      }
    ]);
  });
});
