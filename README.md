# Json Function

[![Build Status](https://travis-ci.com/aykutkardas/Json-Function.svg?branch=master)](https://travis-ci.com/aykutkardas/Json-Function)
[![License](https://img.shields.io/badge/License-Apache%202.0-green.svg)](http://www.apache.org/licenses/LICENSE-2.0.html)

**Full Size** _~4 kb_

## Install

```
npm install json-function
```

## Usage

### Full class

Example data

```js
const data = [
  {
    userId: 1,
    id: 1,
    title: "delectus aut autem",
    completed: false
  },
  {
    userId: 1,
    id: 2,
    title: "quis ut nam facilis et officia qui",
    completed: false
  },
  {
    userId: 1,
    id: 3,
    title: "fugiat veniam minus",
    completed: false
  },
  {
    userId: 1,
    id: 4,
    title: "et porro tempora",
    completed: true
  }
];
```

Chaining

```js
import JsonFunction from "json-function";

const result = JsonFunction.where({ completed: false })
  .select(["title", "completed"])
  .orderBy("title", "DESC")
  .limit(2)
  .get(data);
```

or Standart

```js
import JsonFunction from "json-function";

JsonFunction.where({ completed: false });
JsonFunction.select(["title", "completed"]);
JsonFunction.orderBy("title", "DESC");
JsonFunction.limit(2);
const result = JsonFunction.get(data);
```

Output

```js
[
  {
    title: "quis ut nam facilis et officia qui",
    completed: false
  },
  {
    title: "fugiat veniam minus",
    completed: false
  }
];
```

## Config

### resetRecord

```js
JsonFunction.limit(2).get(data);
console.log(JsonFunction.option.limit); // null
console.log(JsonFunction.data); // []
```

```js
JsonFunction.limit(2).get(data, { resetRecord: false });
console.log(JsonFunction.option.limit); // [2, 0]
console.log(JsonFunction.data); // [{..}, {..}]

// Manual Reset Method
JsonFunction.reset();
```

# Methods

Instead of an entire "class", you can use only the methods you need.

## Where

**Size** _~0.505 kb_

```js
import { Where } from "json-function";

// Single
// (completed === false)
Where(data, { completed: false });

// Multiple (or)
// (completed === false || userId === 2)
Where(data, [{ completed: false }, { userId: 2 }]);
```

## Select

**Size** _~0,402 kb_

```js
import { Select } from "json-function";

// Single
Select(data, "title");

// Multiple
Select(data, ["title", "completed"]);
```

## Limit

**Size** _~0.273 kb_

```js
import { Limit } from "json-function";

// Limit
Limit(data, 2);

// Limit and Start
Limit(data, 2, 2);
```

## OrderBy

**Size** _~0.488 kb_

```js
import { OrderBy } from "json-function";

OrderBy(data, "title", "DESC");
```

## Schema

**Size** _~0.617 kb_

Example data

```js
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
```

```js
import { Schema } from "json-function";

Schema(data, {
  book: {
    id: "id",
    title: "title"
  },
  firstname: "user.firstname",
  lastname: "user.lastname"
});
```

Output

```js
[
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
];
```

## Schema Tool
Use "callback" for advanced conversions.

```js
Schema(data, (sc) => ({
  id: 'id',
  fullName: sc.join('user.firstname', 'user.lastname')
}));
```

Output

```js
[
  {
    id: 0,
    fullName: "John Doe"
  },
  {
    id: 1,
    fullName: "Johnny Doe"
  }
];
```

Custom seperator

```js
Schema(data, (sc) => ({
  id: 'id',
  fullName: sc.join('user.firstname', 'user.lastname').with('_')
}));
```

Output

```js
[
  {
    id: 0,
    fullName: "John_Doe"
  },
  {
    id: 1,
    fullName: "Johnny_Doe"
  }
];
```