import { where } from "../src/package";
import { expect } from "chai";
import "mocha";

const testData = require("./test-data.json");
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

describe("Where function", () => {
  it("[Single Parametre] Data filtering test using Where function.", () => {
    const result = where(data, { completed: true });
    expect(result).to.deep.equal([
      {
        userId: 1,
        id: 4,
        title: "et porro tempora",
        completed: true
      }
    ]);
  });
  it("[Options deep=true] Data filtering test using Where function.", () => {
    const result = where(data, { "education.isDone": true }, { deep: true });
    expect(result).to.deep.equal([
      {
        userId: 1,
        id: 1,
        title: "delectus aut autem",
        completed: false,
        education: {
          isDone: true
        }
      }
    ]);
  });
  it("[Multiple Parametre] Data filtering test using Where function.", () => {
    const result = where(testData, { completed: false, id: 1 });
    expect(result).to.deep.equal([
      {
        userId: 1,
        id: 1,
        title: "delectus aut autem",
        completed: false
      }
    ]);
  });
  it("[Multiple Parametre] Data filtering test using Or-Where function.", () => {
    const result = where(data, [{ completed: true }, { userId: 2 }]);
    expect(result).to.deep.equal([
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
    ]);
  });
});

describe("Where Tools Function", () => {
  it(".gt() method.", () => {
    const result = where(data, wh => ({
      id: wh.gt(3)
    }));
    expect(result).to.deep.equal([
      {
        userId: 1,
        id: 4,
        title: "et porro tempora",
        completed: true
      }
    ]);
  });
  it(".gte() method.", () => {
    const result = where(data, wh => ({
      id: wh.gte(3)
    }));
    expect(result).to.deep.equal([
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
    ]);
  });
  it(".lt() method.", () => {
    const result = where(data, wh => ({
      id: wh.lt(3)
    }));
    expect(result).to.deep.equal([
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
      }
    ]);
  });
  it(".lte() method.", () => {
    const result = where(data, wh => ({
      id: wh.lte(3)
    }));
    expect(result).to.deep.equal([
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
      }
    ]);
  });
  it(".eq() method.", () => {
    const result = where(data, wh => ({
      id: wh.eq("3")
    }));
    expect(result).to.deep.equal([
      {
        userId: 2,
        id: 3,
        title: "fugiat veniam minus",
        completed: false,
        education: {
          isDone: false
        }
      }
    ]);
  });
  it(".ne() method.", () => {
    const result = where(data, wh => ({
      id: wh.ne("3")
    }));
    expect(result).to.deep.equal([
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
        userId: 1,
        id: 4,
        title: "et porro tempora",
        completed: true
      }
    ]);
  });
  it(".in() method.", () => {
    const result = where(data, wh => ({
      title: wh.in("nam")
    }));
    expect(result).to.deep.equal([
      {
        userId: 2,
        id: 2,
        title: "quis ut nam facilis et officia qui",
        completed: false,
        education: {
          isDone: false
        }
      }
    ]);
  });
  it(".nin() method.", () => {
    const result = where(data, wh => ({
      title: wh.nin("nam")
    }));
    expect(result).to.deep.equal([
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
    ]);
  });
  it(".in() on non-properties method.", () => {
    const result = where(data, wh => ({
      nonproperties: wh.in("nam")
    }));
    expect(result).to.deep.equal([]);
  });
  it(".nin() on non-properties method.", () => {
    const result = where(data, wh => ({
      nonproperties: wh.nin("nam")
    }));
    expect(result).to.deep.equal([]);
  });
  it(".between() method.", () => {
    const result = where(data, wh => ({
      id: wh.between(1, 3)
    }));
    expect(result).to.deep.equal([
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
      }
    ]);
  });
  it(".oneOf() method.", () => {
    const result = where(data, wh => ({
      id: wh.oneOf([1, 2, 3])
    }));
    expect(result).to.deep.equal([
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
      }
    ]);
  });
  it("duplicate advanced where method.", () => {
    const result = where(data, wh => ({
      id: wh.lte(3),
      userId: wh.gt(1)
    }));
    expect(result).to.deep.equal([
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
      }
    ]);
  });
  it("duplicate advanced or where method.", () => {
    const result = where(data, wh => [
      { id: wh.eq(2) },
      { id: wh.eq(3) }
    ]);
    expect(result).to.deep.equal([
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
      }
    ]);
  });
});
