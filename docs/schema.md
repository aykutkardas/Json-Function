# schema

Reshapes each item into a new object. [Back to the documentation](README.md)

```js
import { schema } from "json-function";
```

```ts
schema(data, definition)
```

- `data`: an array of objects, or a single object
- `definition`: an object describing the output, or a callback that receives the `sc` tools and returns one

In a definition, a string is a path to read from the item (dotted paths read nested fields), a nested object builds a nested object, and any other value is copied as it is.

Example data:

```js
const data = [
  { id: 0, user: { firstname: "John", lastname: "Doe" }, title: "Book Name" },
  { id: 1, user: { firstname: "Johnny", lastname: "Doe" }, title: "Book Name 2" }
];
```

## Rename and nest fields

```js
schema(data, {
  book: {
    id: "id",
    title: "title"
  },
  firstname: "user.firstname",
  lastname: "user.lastname"
});
```

Output:

```js
[
  { book: { id: 0, title: "Book Name" }, firstname: "John", lastname: "Doe" },
  { book: { id: 1, title: "Book Name 2" }, firstname: "Johnny", lastname: "Doe" }
]
```

A single object gives a single object back:

```js
schema(data[0], { name: "user.firstname" });
```

Output:

```js
{ name: "John" }
```

## join()

Joins several fields into one string. The default separator is a space.

```js
schema(data, (sc) => ({
  id: "id",
  fullName: sc.join("user.firstname", "user.lastname")
}));
```

Output:

```js
[
  { id: 0, fullName: "John Doe" },
  { id: 1, fullName: "Johnny Doe" }
]
```

Pass `{ separator }` as the last argument to change it:

```js
schema(data, (sc) => ({
  id: "id",
  fullName: sc.join("user.firstname", "user.lastname", { separator: "_" })
}));
```

Output:

```js
[
  { id: 0, fullName: "John_Doe" },
  { id: 1, fullName: "Johnny_Doe" }
]
```

## custom()

Calls your function with the values of the given paths and uses its return value.

```js
const posts = [
  { id: 0, createdAt: "2019-03-07T19:22:36+00:00", user: { firstname: "Aykut", lastname: "Kardaş" } },
  { id: 1, createdAt: "2019-03-02T19:22:36+00:00", user: { firstname: "John", lastname: "Doe" } }
];
```

```js
schema(posts, (sc) => ({
  id: "id",
  fullName: sc.custom(
    (firstname, lastname) => `${firstname.toUpperCase()} ${lastname.toUpperCase()}`,
    "user.firstname",
    "user.lastname"
  ),
  date: sc.custom((createdAt) => createdAt.slice(0, 10), "createdAt"),
  idIncrement: sc.custom((id) => id + 1, "id")
}));
```

Output:

```js
[
  { id: 0, fullName: "AYKUT KARDAŞ", date: "2019-03-07", idIncrement: 1 },
  { id: 1, fullName: "JOHN DOE", date: "2019-03-02", idIncrement: 2 }
]
```
