# select

Keeps only the given fields of each item. [Back to the documentation](README.md)

```js
import { select } from "json-function";
```

```ts
select(data, fields, options?)
```

- `fields`: a field name or an array of field names
- `options.deep`: read dotted field names such as `"book.title"` as paths and build nested output

Fields that are missing from an item are left out of that item's result.

Example data:

```js
const data = [
  { firstname: "John", lastname: "Doe", book: { id: 0, title: "Book Name" } },
  { firstname: "Johnny", lastname: "Doe", book: { id: 1, title: "Book Name 2" } }
];
```

## One field

```js
select(data, "firstname");
```

Output:

```js
[{ firstname: "John" }, { firstname: "Johnny" }]
```

## Several fields

```js
select(data, ["firstname", "lastname"]);
```

Output:

```js
[
  { firstname: "John", lastname: "Doe" },
  { firstname: "Johnny", lastname: "Doe" }
]
```

## Deep fields

```js
select(data, ["firstname", "book.title"], { deep: true });
```

Output:

```js
[
  { firstname: "John", book: { title: "Book Name" } },
  { firstname: "Johnny", book: { title: "Book Name 2" } }
]
```

To rename fields or reshape items, use [schema](schema.md).
