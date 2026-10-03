# where

Filters an array of objects. [Back to the documentation](README.md)

```js
import { where } from "json-function";
```

```ts
where(data, queries, options?)
```

- `queries`: an object, an array of objects, or a callback that returns either
- `options.deep`: read dotted field names such as `"education.isDone"` as paths

Example data:

```js
const data = [
  { id: 1, userId: 1, title: "delectus aut autem", completed: false, education: { isDone: true } },
  { id: 2, userId: 1, title: "lorem ipsum", completed: true, education: { isDone: true } },
  { id: 3, userId: 2, title: "quis ut nam facilis et officia qui", completed: false, education: { isDone: false } }
];
```

## Single field

Fields are compared with `===`.

```js
where(data, { userId: 1 });
```

Output:

```js
[
  { id: 1, userId: 1, title: "delectus aut autem", completed: false, education: { isDone: true } },
  { id: 2, userId: 1, title: "lorem ipsum", completed: true, education: { isDone: true } }
]
```

## AND

All fields of a query must match.

```js
where(data, { userId: 1, completed: true });
```

Output:

```js
[
  { id: 2, userId: 1, title: "lorem ipsum", completed: true, education: { isDone: true } }
]
```

## OR

With an array of queries, an item is kept if it matches any of them. Each item appears once, in its original order.

```js
where(data, [{ userId: 1, completed: true }, { userId: 2, completed: false }]);
```

Output:

```js
[
  { id: 2, userId: 1, title: "lorem ipsum", completed: true, education: { isDone: true } },
  { id: 3, userId: 2, title: "quis ut nam facilis et officia qui", completed: false, education: { isDone: false } }
]
```

## Deep fields

Pass `{ deep: true }` to read nested fields with a dotted path.

```js
where(data, { "education.isDone": false }, { deep: true });
```

Output:

```js
[
  { id: 3, userId: 2, title: "quis ut nam facilis et officia qui", completed: false, education: { isDone: false } }
]
```

## Comparison helpers

Pass a callback to use comparison helpers. It receives `wh` and returns the queries.

```js
where(data, (wh) => ({ id: wh.lte(2) })).map((item) => item.id);
```

Output:

```js
[1, 2]
```

The callback can also return an array of queries for OR:

```js
where(data, (wh) => [{ id: wh.eq(1) }, { title: wh.in("ipsum") }]).map((item) => item.id);
```

Output:

```js
[1, 2]
```

Available helpers:

```ts
wh.lte(3)            // value <= 3
wh.lt(3)             // value <  3
wh.gte(3)            // value >= 3
wh.gt(3)             // value >  3
wh.between(3, 5)     // value >= 3 && value <= 5
wh.eq("3")           // value == "3"  (loose equality)
wh.ne("3")           // value != "3"  (loose inequality)
wh.in("test")        // value.includes("test"), for strings and arrays
wh.nin("test")       // !value.includes("test"), for strings and arrays
wh.oneOf([1, 2, 3])  // [1, 2, 3].includes(value)
```

Any function works as a field value, not only the helpers:

```js
where(data, { title: (title) => title.length < 15 }).map((item) => item.id);
```

Output:

```js
[2]
```
