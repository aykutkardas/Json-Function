# Json Function

[![npm](https://img.shields.io/npm/v/json-function?color=4fc921)](https://www.npmjs.com/package/json-function)
[![License](https://img.shields.io/npm/l/json-function?color=4fc921)](https://github.com/aykutkardas/Json-Function/blob/main/LICENSE)
[![Test](https://github.com/aykutkardas/Json-Function/actions/workflows/test.yml/badge.svg)](https://github.com/aykutkardas/Json-Function/actions/workflows/test.yml)

Use `where`, `select`, `orderBy`, `limit` and more on arrays of JSON objects. Each function works on its own, or you can chain them into a query. No dependencies, TypeScript types included, and fast on large arrays.

**[Documentation](docs/README.md)** • **[Changelog](CHANGELOG.md)**

## Install

```bash
npm install json-function
```

or

```bash
pnpm add json-function
```

Requires Node.js 20.19 or later. The package is an ES module; `require("json-function")` also works on these versions.

## Usage

Chain methods and run the query with `get`:

```js
import JsonFunction from "json-function";

const result = JsonFunction
  .where({ completed: false })
  .select(["title", "completed"])
  .orderBy("title", "DESC")
  .limit(2)
  .get(data);
```

Or use only the functions you need:

```js
import { where, orderBy } from "json-function";

const incomplete = where(data, { completed: false });
const sorted = orderBy(incomplete, "title", "DESC");
```

Every chain method returns a new query, so partial queries can be reused, and `getQuery()`/`setQuery()` save and restore them. See [Chaining](docs/README.md#chaining).

## Functions

| Function | What it does |
|---|---|
| [`where`](docs/where.md) | Filter by field values, with AND, OR, deep fields and comparison helpers (`wh.gt`, `wh.in`, ...) |
| [`search`](docs/search.md) | Find items whose fields contain a text |
| [`select`](docs/select.md) | Keep only some fields, including nested ones |
| [`orderBy`](docs/order-by.md) | Sort by a field, ascending or descending |
| [`limit`](docs/limit.md) | Take a number of items from a start index |
| [`schema`](docs/schema.md) | Rename, nest, join and compute fields |
| [`innerJoin` / `leftJoin`](docs/joins.md) | Join two arrays on a field |
| [`toArray`](docs/to-array.md) | Turn an object of objects into an array |

## TypeScript

Types are included, and standalone functions keep the item type of their input: `where(users, ...)` returns `User[]` and `select(users, ["id", "name"])` returns `Pick<User, "id" | "name">[]`. See [TypeScript](docs/README.md#typescript).

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
- **ES module only, Node.js 20.19+.** The package no longer ships a separate CommonJS build. `import` works everywhere, and `require("json-function")` keeps working on Node.js 20.19+ and 22.12+, which can load ES modules with `require`. On older Node.js versions `require` fails with `ERR_REQUIRE_ESM`.
- **TypeScript:** functions are generic, so results keep their item type.
