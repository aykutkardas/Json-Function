# Json Function documentation

Json Function lets you use `where`, `select`, `orderBy`, `limit` and more on arrays of JSON objects. Each function works on its own, and they can also be chained into a query.

- [Getting started](#getting-started)
- [Chaining](#chaining)
- [Saving and reusing queries](#saving-and-reusing-queries)
- [TypeScript](#typescript)
- Functions: [where](where.md) · [search](search.md) · [select](select.md) · [orderBy](order-by.md) · [limit](limit.md) · [schema](schema.md) · [innerJoin and leftJoin](joins.md) · [toArray](to-array.md)
- [Changelog](../CHANGELOG.md)

> Every example that has an **Output** block is run against the library by the test suite, so the outputs on these pages match the current version.

## Getting started

```bash
npm install json-function
```

Json Function is an ES module and needs Node.js 20.19 or later, where both `import` and `require` work.

```js
import JsonFunction, { where, select, orderBy, limit } from "json-function";
```

The examples on this page use this data:

```js
const data = [
  { userId: 1, id: 1, title: "delectus aut autem", completed: false },
  { userId: 1, id: 2, title: "quis ut nam facilis et officia qui", completed: false },
  { userId: 1, id: 3, title: "fugiat veniam minus", completed: false },
  { userId: 1, id: 4, title: "et porro tempora", completed: true }
];
```

## Chaining

Chain methods on `JsonFunction` and run the query with `get(data)`. Steps run in the order they were added.

```js
JsonFunction
  .where({ completed: false })
  .select(["title", "completed"])
  .orderBy("title", "DESC")
  .limit(2)
  .get(data);
```

Output:

```js
[
  { title: "quis ut nam facilis et officia qui", completed: false },
  { title: "fugiat veniam minus", completed: false }
]
```

Every method returns a new query and never changes the one it was called on. You can build a query step by step and reuse a partial query:

```js
const incomplete = JsonFunction.where({ completed: false });
```

```js
incomplete.orderBy("id", "DESC").limit(1).get(data);
```

Output:

```js
[{ userId: 1, id: 3, title: "fugiat veniam minus", completed: false }]
```

```js
incomplete.select("id").get(data);
```

Output:

```js
[{ id: 1 }, { id: 2 }, { id: 3 }]
```

> In 1.x, calling methods one by one without using the return value (`JsonFunction.where(...); JsonFunction.limit(2); JsonFunction.get(data);`) built a shared query. That no longer works; see [Migrating from 1.x](../README.md#migrating-from-1x).

The chain methods are `where`, `search`, `orderBy`, `limit`, `select`, `schema`, `innerJoin` and `leftJoin`. They take the same arguments as the standalone functions, without the data argument.

Chains are optimized for large arrays: filters and limits run in a single pass that stops as soon as the limit is full, and `orderBy` followed by `limit` only keeps the top items instead of sorting everything. The result is always the same as running the steps one by one.

## Saving and reusing queries

`getQuery()` returns the steps of a query as an array, which you can store and run later:

```js
const twoIncompleteTasks = JsonFunction
  .where({ completed: false })
  .select(["title", "completed"])
  .limit(2)
  .getQuery();
```

```js
JsonFunction.setQuery(twoIncompleteTasks).get(data);
```

Output:

```js
[
  { title: "delectus aut autem", completed: false },
  { title: "quis ut nam facilis et officia qui", completed: false }
]
```

`get` also accepts a query, which runs after the steps already in the chain:

```js
JsonFunction.get(data, { query: twoIncompleteTasks });
```

Output:

```js
[
  { title: "delectus aut autem", completed: false },
  { title: "quis ut nam facilis et officia qui", completed: false }
]
```

Queries saved by 1.x (an object with `where`, `limit`, ... keys) are still accepted by `setQuery` and `get`.

## TypeScript

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
