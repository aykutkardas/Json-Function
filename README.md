# Json Function
[![Build Status](https://travis-ci.com/aykutkardas/Json-Function.svg?branch=master)](https://travis-ci.com/aykutkardas/Json-Function)

**Full Size** *~2.276 kb*

## Install

```
yarn add json-function
```
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
import JsonFunction from 'json-function';

const result = JsonFunction
      .where({ completed: false })
      .select(["title", "completed"])
      .orderBy("title", "DESC")
      .limit(2)
      .get(data);
```

or Standart

```js
import JsonFunction from 'json-function';

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
]
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
**Size** *0.369 kb*
```js
import { Where } from 'json-function';

// Single
// (completed === false)
Where(data, { completed: false });

// Multiple (or)
// (completed === false || userId === 2)
Where(data, [{completed: false}, {userId: 2}]); 
```


## Select
**Size** *0,360 kb*
```js
import { Select } from 'json-function';

// Single
Select(data, "title");

// Multiple
Select(data, ["title", "completed"]); 
```

## Limit
**Size** *0.215 kb*
```js
import { Limit } from 'json-function';

// Limit
Limit(data, 2);

// Limit and Start
Limit(data, 2, 2); 
```

## OrderBy
**Size** *0.282 kb*
```js
import { OrderBy } from 'json-function';

OrderBy(data, "title", "DESC");
```

## Schema
**Size** *0.789 kb*
```js
import { Schema } from 'json-function';

Schema(data, {
  "user.firstname": "firstname",
  "user.lastname": "lastname"
});
```
