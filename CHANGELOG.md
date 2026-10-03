# Changelog

## 2.0.0 - Unreleased

See [Migrating from 1.x](README.md#migrating-from-1x) for how to update.

### Changed (breaking)

* Chaining is immutable. Every method returns a new query, so a chain that is never run can no longer leak into the next query. Calling methods one by one without using the return value no longer builds a query, and the `resetRecord` option and the `option`/`data` properties are removed.
* `getQuery()` returns an ordered array of steps, and steps run in the order they were added. Queries in the 1.x object format are still accepted.
* `innerJoin` is a real inner join: items without a match are dropped, and an item with several matches appears once per match.
* `where` with several queries returns each matching item once, in input order.
* `search` matches the key literally instead of as a regular expression, skips missing fields, and is case sensitive unless `caseSensitive: false` is passed.
* Stricter, generic TypeScript types.
* The package is built with tsup and ships CommonJS, ES modules and type declarations.

### Removed

* `transform` and the chain's `.transform()`.

### Added

* `leftJoin`, with one row per match.
* `select` reads dotted paths with `{ deep: true }`.
* Documentation moved from GitBook into the repository (`docs/`). Its examples are run by the tests.

### Fixed

* `orderBy` no longer sorts the input array in place.
* `search` no longer throws for keys such as `"c++"`, and missing fields no longer match as `"undefined"`.
* Keys named `__proto__` in data or in `select`/`schema` arguments can no longer change object prototypes or `Object.prototype`.
* A saved query no longer drops steps or replays them in a different order.

### Optimized

* Queries on large arrays are much faster: property paths, `where`, `search`, `select` and `schema` are compiled once instead of per item, `orderBy` reads each sort key once, and chains run filters and limits in one pass and select the top items for `orderBy` + `limit`. For example, `search` on 200,000 items went from 65 ms to 4 ms.

## 1.8.14 - 1.8.39

These releases were not recorded in this changelog. See the [commit history](https://github.com/aykutkardas/Json-Function/commits/main) for details.

## 1.8.13 - 2020-01-18

### Optimized

* The "Where" function has been optimized. Now 76.7% faster.

## 1.8.12 - 2020-01-17

### Optimized

* The "Select" function has been optimized. Now 15% faster.

## 1.8.11 - 2020-01-16

### Fixed

* Fixed a fatal error in the "Where" function.

## 1.8.8 - 2020-01-10

### Added

* Object support is added to "Schema" and "Transform" functions.

## 1.8.6 - 2019-12-12

### Fixed

* Fixed a problem in the "Transform" function.

## 1.8.5 - 2019-12-07

### Added

* Added transform function.

## 1.8.1 - 2019-03-19

### Changed

* "WhereTool" and "SchemaTool" tools have been optimized.
* The "lodash.clonedeep" dependency has been removed.

## 1.7.1 - 2019-03-16

### Added

* Added where function advanced filter methods.

## 1.6.2 - 2019-03-12

### Changed

* Schema function join method option name fixed. **seperator** to **separator**.

### Added

* Added auto-completion and type support for editors. (**index.d.ts**)

## 1.5.0 - 2019-03-08

### Changed

* **join().with()** method changed to **join(...args, { seperator: value })**.
* get-obj-deep-prop utils update.
* **Schema** function added **lodash.clonedeep.**

## 1.4.0 - 2019-03-07

### Added

* **custom()** method was added to **Schema** tool.

## 1.3.0 - 2019-01-27

### Added

* **setQuery()** and **getQuery()** method added.

## 1.2.0 - 2019-01-25

### Fixed

* get-obj-deep-prop utils update.

### Changed

* All method names have been converted from **CapitalCase** to **camelCase**.

## 1.1.1 - 2019-01-25

### Added

* **innerJoin()** method added.
