# Json Function

[![npm](https://img.shields.io/npm/v/json-function?color=4fc921)](https://www.npmjs.com/package/json-function)
[![License](https://img.shields.io/npm/l/json-function?color=4fc921)](https://github.com/aykutkardas/Json-Function/blob/main/LICENSE)
[![Test](https://github.com/aykutkardas/Json-Function/actions/workflows/test.yml/badge.svg)](https://github.com/aykutkardas/Json-Function/actions/workflows/test.yml)

## [Documentation](https://worn.gitbook.io/json-function/) • [Changelog](https://worn.gitbook.io/json-function/changelog)

Lets you use where, limit, select, orderBy, and more in JSON data.

> The documentation site still describes 1.x. For what changed in 2.0, see [Migrating from 1.x](#migrating-from-1x).

## Install

```
npm install json-function
```

or

```
pnpm add json-function
```

# Usage

## JsonFunction • [documentation](https://worn.gitbook.io/json-function/)

Json-Function provides query helpers for arrays of JSON objects, so you don't have to rewrite the same filtering, sorting and mapping code.

You can use each method on its own, or chain them together.

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

Every method returns a new query, so you can also build one step by step or reuse a partial query. Steps run in the order they were added.

```js
import JsonFunction from "json-function";

let query = JsonFunction.where({ completed: false });
query = query.select(["title", "completed"]);

const firstTwo = query.limit(2).get(data);
const sorted = query.orderBy("title", "DESC").get(data);
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

The "innerJoin" function is used to join two arrays. Like SQL's `INNER JOIN`, items without a match are dropped and an item with several matches appears once per match.


```js
import { innerJoin } from "json-function";

innerJoin(data, data2, "id", "userId");
```

## leftJoin

Same as `innerJoin`, but items without a match are kept unchanged (SQL's `LEFT JOIN`).

```js
import { leftJoin } from "json-function";

leftJoin(data, data2, "id", "userId");
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

// Multiple fields (and)
// (completed === false && userId === 2)
where(data, { completed: false, userId: 2 });

// Multiple queries (or)
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

// Deep
// { id: 1, user: { firstname: "John" } }
select(data, ["id", "user.firstname"], { deep: true });
```

## limit • [documentation](https://worn.gitbook.io/json-function/functions/limit)

"Limit" returns a limited number of items, optionally starting from a given index. It works like `slice()` with a count instead of an end index.

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

// case insensitive (search is case sensitive by default)
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

# TypeScript

Types are included. Standalone functions keep the item type of their input:

```ts
import { where, select } from "json-function";

type User = { id: number; name: string; city: string };

where(users, { city: "Ankara" }); // User[]
select(users, ["id", "name"]);    // Pick<User, "id" | "name">[]
```

Chains don't track the type through every step, so pass the result type to `get` if you know it:

```ts
JsonFunction.where({ city: "Ankara" }).get<User>(users); // User[]
```

# Migrating from 1.x

- **Chaining is immutable.** Every method returns a new query instead of changing a shared one. Calling methods one by one without using the return value no longer builds a query:

  ```js
  // 1.x
  JsonFunction.where({ completed: false });
  JsonFunction.limit(2);
  JsonFunction.get(data);

  // 2.x
  const query = JsonFunction.where({ completed: false }).limit(2);
  query.get(data);
  ```

  The `resetRecord` option and the `option`/`data` properties are gone.
- **`getQuery()` returns an ordered list of steps** and the steps run in that order. Queries saved in the old object format are still accepted by `setQuery()` and `get(data, { query })`.
- **`innerJoin` is a real inner join.** Items without a match are dropped and an item with several matches appears once per match. Use `leftJoin` to keep unmatched items.
- **`where` with several queries** returns each matching item once, in input order.
- **`orderBy` no longer sorts the input array in place.**
- **`search` matches the key literally** (no regular expressions), skips missing fields, and is case sensitive unless `caseSensitive: false` is passed.
- **`transform` and `.transform()` are removed.** Converting key casing is outside what this library queries, and the function was the source of a prototype pollution issue. Use a package such as [`camelcase-keys`](https://www.npmjs.com/package/camelcase-keys) (`camelcaseKeys(data, { deep: true })`), or rename specific fields with `schema(data, { userId: "user_id" })`.
- **TypeScript:** functions are generic, so results keep their item type.
