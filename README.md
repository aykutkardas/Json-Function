# Json Function

[![Build Status](https://travis-ci.com/aykutkardas/Json-Function.svg?branch=master)](https://travis-ci.com/aykutkardas/Json-Function)
[![License](https://img.shields.io/badge/License-Apache%202.0-green.svg)](http://www.apache.org/licenses/LICENSE-2.0.html)

**Full Size** _~4 kb_


## [Documentation](https://worn.gitbook.io/json-function/) • [Changelog](https://worn.gitbook.io/json-function/changelog)

## Install

```
npm install json-function
```

# Usage

## JsonFunction [• documentation](https://worn.gitbook.io/json-function/)

Chaining

```js
import JsonFunction from "json-function";

const result = JsonFunction
  .where({ completed: false })
  .select(["title", "completed"])
  .orderBy("title", "DESC")
  .limit(2)
  .get(data);
```

or Basic

```js
import JsonFunction from "json-function";

JsonFunction.where({ completed: false });
JsonFunction.select(["title", "completed"]);
JsonFunction.orderBy("title", "DESC");
JsonFunction.limit(2);
const result = JsonFunction.get(data);
```

or create a query and use it at any time.
```js
const queryTwoIncompleteTasks = JsonFunction
  .where({ completed: false })
  .select(["title", "completed"])
  .limit(2)
  .getQuery();
  
```

Query usage
```js
JsonFunction.setQuery(queryTwoIncompleteTasks).get(data);
// or
JsonFunction.get(data, { query: queryTwoIncompleteTasks });
```


# Methods

Instead of an entire "class", you can use only the methods you need.

## innerJoin [• documentation](https://worn.gitbook.io/json-function/functions/inner-join)


```js
import { innerJoin } from "json-function";

innerJoin(data, data2, "id", "userId");
```

## schema [• documentation](https://worn.gitbook.io/json-function/functions/schema)

```js
import { schema } from "json-function";

schema(data, {
  book: {
    id: "id",
    title: "title"
  },
  firstname: "user.firstname",
  lastname: "user.lastname"
});
```

Use "callback" for advanced conversions.

```js
schema(data, (sc) => ({
  id: 'id',
  fullName: sc.join('user.firstname', 'user.lastname')
}));
```

Custom seperator

```js
schema(data, (sc) => ({
  id: 'id',
  fullName: sc.join('user.firstname', 'user.lastname', { seperator: '_' })
}));
```

## where [• documentation](https://worn.gitbook.io/json-function/functions/where)


```js
import { where } from "json-function";

// Single
// (completed === false)
where(data, { completed: false });

// Multiple (or)
// (completed === false || userId === 2)
where(data, [{ completed: false }, { userId: 2 }]);
```

## select [• documentation](https://worn.gitbook.io/json-function/functions/select)


```js
import { select } from "json-function";

// Single
select(data, "title");

// Multiple
select(data, ["title", "completed"]);
```

## limit [• documentation](https://worn.gitbook.io/json-function/functions/limit)


```js
import { limit } from "json-function";

// limit
limit(data, 2);

// limit and Start
limit(data, 2, 2);
```

## orderBy [• documentation](https://worn.gitbook.io/json-function/functions/order-by)


```js
import { orderBy } from "json-function";

orderBy(data, "title", "DESC");
```