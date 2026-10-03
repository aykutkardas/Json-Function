import { describe, it, expect } from "vitest";
import { schema } from "../src/package";

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

describe("Schema Function for Array", () => {
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

describe("Schema Tools Function for Array", () => {
  it(".join() method.", () => {
    const result = schema(data, sc => ({
      fullName: sc.join("user.firstname", "user.lastname"),
      book: {
        id: "id",
        title: "title"
      }
    }));

    expect(result).to.deep.equal([
      {
        fullName: "John Doe",
        book: {
          id: 0,
          title: "Book Name"
        }
      },
      {
        fullName: "Johnny Doe",
        book: {
          id: 1,
          title: "Book Name 2"
        }
      }
    ]);
  });
  it(".join() method use with separator.", () => {
    const result = schema(data, sc => ({
      fullName: sc.join("user.firstname", "user.lastname", { separator: "_" }),
      book: {
        id: "id",
        title: "title"
      }
    }));

    expect(result).to.deep.equal([
      {
        fullName: "John_Doe",
        book: {
          id: 0,
          title: "Book Name"
        }
      },
      {
        fullName: "Johnny_Doe",
        book: {
          id: 1,
          title: "Book Name 2"
        }
      }
    ]);
  });
  it(".custom() method.", () => {
    const result = schema(data, sc => ({
      fullName: sc.custom(
        (firstname: string, lastname: string) => {
          return firstname.toUpperCase() + " " + lastname.toUpperCase();
        },
        "user.firstname",
        "user.lastname"
      ),
      book: {
        id: "id",
        title: "title"
      }
    }));

    expect(result).to.deep.equal([
      {
        fullName: "JOHN DOE",
        book: {
          id: 0,
          title: "Book Name"
        }
      },
      {
        fullName: "JOHNNY DOE",
        book: {
          id: 1,
          title: "Book Name 2"
        }
      }
    ]);
  });
  it("complex sc methods.", () => {
    const result = schema(data, sc => ({
      fullName: sc.join("user.firstname", "user.lastname"),
      book: {
        deepTitle: sc.custom((title: string) => title.toUpperCase(), "title")
      },
      id: sc.custom((id: number) => id + 1, "id")
    }));

    expect(result).to.deep.equal([
      {
        fullName: "John Doe",
        id: 1,
        book: {
          deepTitle: "BOOK NAME"
        }
      },
      {
        fullName: "Johnny Doe",
        id: 2,
        book: {
          deepTitle: "BOOK NAME 2"
        }
      }
    ]);
  });
  it("duplicate .join() methods.", () => {
    const result = schema(data, sc => ({
      fullName: sc.join("user.firstname", "user.lastname"),
      book: {
        deepTitle: sc.join("id", "title")
      },
      oneRowData: sc.join("id", "title", "user.firstname", "user.lastname", {
        separator: "_"
      })
    }));

    expect(result).to.deep.equal([
      {
        fullName: "John Doe",
        book: {
          deepTitle: "0 Book Name"
        },
        oneRowData: "0_Book Name_John_Doe"
      },
      {
        fullName: "Johnny Doe",
        book: {
          deepTitle: "1 Book Name 2"
        },
        oneRowData: "1_Book Name 2_Johnny_Doe"
      }
    ]);
  });
});

describe("Schema Unexpected Data for Array", () => {
  it(".join() method with null data.", () => {
    const result = schema(null, sc => ({
      fullName: sc.join("user.firstname", "user.lastname"),
      book: {
        id: "id",
        title: "title"
      }
    }));

    expect(result).to.deep.equal(null);
  });
});

describe("Schema output objects", () => {
  it("Builds separate nested objects for every item.", () => {
    const result = schema(data, { book: { id: "id" } });
    expect(result[0].book).to.not.equal(result[1].book);
    result[0].book.id = 99;
    expect(result[1].book.id).to.equal(1);
  });

  it("Copies non-path values as they are.", () => {
    const result = schema(data, { id: "id", version: 2 as any, active: true as any });
    expect(result).to.deep.equal([
      { id: 0, version: 2, active: true },
      { id: 1, version: 2, active: true },
    ]);
  });

  it("Does not change the schema definition.", () => {
    const definition = { id: "id", book: { title: "title" } };
    schema(data, definition);
    expect(definition).to.deep.equal({ id: "id", book: { title: "title" } });
  });

  it("Reads missing paths as undefined.", () => {
    expect(schema(data, { missing: "user.middle.name" })).to.deep.equal([
      { missing: undefined },
      { missing: undefined },
    ]);
  });
});
