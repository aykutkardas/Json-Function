# orderBy

Sorts an array of objects by a field. [Back to the documentation](README.md)

```js
import { orderBy } from "json-function";
```

```ts
orderBy(data, field, order?, options?)
```

- `order`: `"ASC"` (default) or `"DESC"`, in any letter case
- `options.deep`: read a dotted field name such as `"address.city"` as a path

`orderBy` returns a new array and leaves the input unchanged. Items with equal values keep their original order. Numbers and strings are compared with `<` and `>`, so mixing types or leaving the field empty on some items gives an order that is hard to predict.

Example data:

```js
const data = [
  { id: 1, userId: 1, title: "quis ut nam facilis et officia qui" },
  { id: 2, userId: 1, title: "lorem ipsum" },
  { id: 3, userId: 2, title: "delectus aut autem" }
];
```

## Descending

```js
orderBy(data, "id", "DESC");
```

Output:

```js
[
  { id: 3, userId: 2, title: "delectus aut autem" },
  { id: 2, userId: 1, title: "lorem ipsum" },
  { id: 1, userId: 1, title: "quis ut nam facilis et officia qui" }
]
```

## Ascending

`"ASC"` is the default, so `orderBy(data, "title")` gives the same result.

```js
orderBy(data, "title", "ASC");
```

Output:

```js
[
  { id: 3, userId: 2, title: "delectus aut autem" },
  { id: 2, userId: 1, title: "lorem ipsum" },
  { id: 1, userId: 1, title: "quis ut nam facilis et officia qui" }
]
```

## Equal values

Items with the same value stay in input order:

```js
orderBy(data, "userId").map((item) => item.id);
```

Output:

```js
[1, 2, 3]
```

## Deep fields

```js
const cities = [
  { id: 1, address: { city: "New York" } },
  { id: 2, address: { city: "Detroit" } },
  { id: 3, address: { city: "Dallas" } }
];
```

```js
orderBy(cities, "address.city", "ASC", { deep: true });
```

Output:

```js
[
  { id: 3, address: { city: "Dallas" } },
  { id: 2, address: { city: "Detroit" } },
  { id: 1, address: { city: "New York" } }
]
```
