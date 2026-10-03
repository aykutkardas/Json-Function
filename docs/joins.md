# innerJoin and leftJoin

Join two arrays on a field, like SQL's `INNER JOIN` and `LEFT JOIN`. [Back to the documentation](README.md)

```js
import { innerJoin, leftJoin } from "json-function";
```

```ts
innerJoin(data, otherData, dataField, otherDataField)
leftJoin(data, otherData, dataField, otherDataField)
```

An item of `data` matches an item of `otherData` when `item[dataField] === otherItem[otherDataField]`. Field names can be dotted paths such as `"user.id"`. Matched items are merged into one object; if both have a field with the same name, the value from `otherData` is used.

Example data:

```js
const todos = [
  { id: 1, userId: 1, title: "delectus aut autem" },
  { id: 2, userId: 2, title: "quis ut nam facilis et officia qui" },
  { id: 3, userId: 3, title: "fugiat veniam minus" }
];

const users = [
  { userId: 1, firstName: "John" },
  { userId: 2, firstName: "Mike" }
];
```

## innerJoin

Items without a match are dropped.

```js
innerJoin(todos, users, "userId", "userId");
```

Output:

```js
[
  { id: 1, userId: 1, title: "delectus aut autem", firstName: "John" },
  { id: 2, userId: 2, title: "quis ut nam facilis et officia qui", firstName: "Mike" }
]
```

## leftJoin

Items without a match are kept unchanged.

```js
leftJoin(todos, users, "userId", "userId");
```

Output:

```js
[
  { id: 1, userId: 1, title: "delectus aut autem", firstName: "John" },
  { id: 2, userId: 2, title: "quis ut nam facilis et officia qui", firstName: "Mike" },
  { id: 3, userId: 3, title: "fugiat veniam minus" }
]
```

## Several matches

An item that matches several items appears once per match, in both joins:

```js
const tags = [
  { todoId: 1, tag: "home" },
  { todoId: 1, tag: "urgent" }
];
```

```js
innerJoin(todos, tags, "id", "todoId").map((item) => [item.id, item.tag]);
```

Output:

```js
[[1, "home"], [1, "urgent"]]
```
