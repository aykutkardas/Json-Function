# limit

Returns a number of items, optionally starting from an index. [Back to the documentation](README.md)

```js
import { limit } from "json-function";
```

```ts
limit(data, count = 10, start = 0)
```

It works like `data.slice(start, start + count)`.

Example data:

```js
const data = [
  { id: 1, userId: 1, title: "quis ut nam facilis et officia qui" },
  { id: 2, userId: 1, title: "lorem ipsum" },
  { id: 3, userId: 2, title: "delectus aut autem" }
];
```

## Count

```js
limit(data, 2);
```

Output:

```js
[
  { id: 1, userId: 1, title: "quis ut nam facilis et officia qui" },
  { id: 2, userId: 1, title: "lorem ipsum" }
]
```

## Count and start

```js
limit(data, 2, 1);
```

Output:

```js
[
  { id: 2, userId: 1, title: "lorem ipsum" },
  { id: 3, userId: 2, title: "delectus aut autem" }
]
```
