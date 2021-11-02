# Json Function

[![npm](https://img.shields.io/npm/v/json-function?color=%234fc921)](https://www.npmjs.com/package/json-function)
[![License](https://img.shields.io/badge/License-MIT-green.svg?color=%234fc921)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/aykutkardas/Json-Function/workflows/Test/badge.svg?color=%234fc921)](https://github.com/aykutkardas/Json-Function/actions)

## [Documentation](https://worn.gitbook.io/json-function/) • [Changelog](https://worn.gitbook.io/json-function/changelog)

Lets you use where, limit, select, orderBy, and more in JSON data.

## Install

```
npm install json-function
```

or

```
yarn add json-function
```

# Usage

## JsonFunction • [documentation](https://worn.gitbook.io/json-function/)

Json-Function provides a lot of useful functions especially for your json data. It contains the methods you need too much to eliminate unnecessary code repetition.

You can use the Json-Function methods separately, but it is possible to use them all together. You can also chain it.

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

## innerJoin • [documentation](https://worn.gitbook.io/json-function/functions/inner-join)

The "innerJoin" function is used to join two arrays.


```js
import { innerJoin } from "json-function";

innerJoin(data, data2, "id", "userId");
```

## schema • [documentation](https://worn.gitbook.io/json-function/functions/schema)

The "Schema" function is a great way to reconfigure your json data and make it your own.

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
  id: "id",
  fullName: sc.join("user.firstname", "user.lastname")
}));
```

Custom separator

```js
schema(data, (sc) => ({
  id: "id",
  fullName: sc.join("user.firstname", "user.lastname", { separator: "_" })
}));
```

Use your own special function.
```js
schema(data, (sc) => ({
  id: "id",
  fullName: sc.custom(
    (firstname, lastname) => `${firstname.toUpperCase()} ${lastname.toUpperCase()}`,
    "user.firstname",
    "user.lastname"
  ),
}))
```

Example
```js
schema(data, (sc) => ({
  id: "id",
  createdAt: sc.custom(
    (createdAt) => moment(createdAt).format("DD/MM/YYYY"),
    "createdAt",
  ),
}))
```
## where • [documentation](https://worn.gitbook.io/json-function/functions/where) • [samples](https://nj0ql.csb.app/)

The "Where" function provides a comfortable method for filtering a json data.

```js
import { where } from "json-function";

// Single
// (completed === false)
where(data, { completed: false });

// Multiple (or)
// (completed === false || userId === 2)
where(data, [{ completed: false }, { userId: 2 }]);

// Deep
// (address.city === "New York")
where(data, { "address.city": "New York" }, { deep: true });
```

Use "callback" for advanced filter.

```js
// id <= 3
where(data, (wh) => ({
  id: wh.lte(3),
}));
```

Other **wh** methods.
```js
wh.lte(3)             // value <= 3
wh.lt(3)              // value <  3
wh.gte(3)             // value >= 3
wh.gt(3)              // value >  3
wh.between(3,5)       // value >= 3 && value <= 5
wh.eq("3")            // value == 3
wh.ne("3")            // value != 3
wh.in("test")         // value.includes("test")
wh.nin("test")        // !value.includes("test")
wh.oneOf([1, 2, 3])  // [1, 2, 3].includes(value)
```

## select • [documentation](https://worn.gitbook.io/json-function/functions/select)

The "Select" function is a practical method where you only get the desired fields of a json data.

```js
import { select } from "json-function";

// Single
select(data, "title");

// Multiple
select(data, ["title", "completed"]);
```

## limit • [documentation](https://worn.gitbook.io/json-function/functions/limit)

"Limit" is used to get a limited number of elements from a json data. Almost javascript works like slice() but it is much easier and clearer.

```js
import { limit } from "json-function";

// limit
limit(data, 2);

// limit and Start
limit(data, 2, 2);
```

## orderBy • [documentation](https://worn.gitbook.io/json-function/functions/order-by)

With the "orderBy" function you can reorder the data in your json array.

```js
import { orderBy } from "json-function";

orderBy(data, "title", "DESC");

orderBy(data, "user.firstname", "DESC", { deep: true });
```

## search • [documentation](https://worn.gitbook.io/json-function/functions/search)

Search over fields of objects.

```js
import { search } from "json-function";

// Syntax: search(data: Object[], key: any, fields: string | string[], options?);

// single field
search(data, "key", "description");

// multiple field
search(data, "key", ["user.firstName", "description"]);

// case sensitive
search(data, "key", "description", { caseSensitive: false });
```

## toArray • [documentation](https://worn.gitbook.io/json-function/functions/to-array)

Converts objects into meaningful sequences.


```js
import { toArray } from "json-function";

// default key "uid"
toArray(data);

// custom key
toArray(data, { key: "_id_" });
```

## transform • [documentation](https://worn.gitbook.io/json-function/functions/transform)
JSON converts the snake_case keys in your data to camelCase.

```js
import { transform } from "json-function";

transform(data);
```