# search

Finds items whose fields contain a text, or equal a value. [Back to the documentation](README.md)

```js
import { search } from "json-function";
```

```ts
search(data, key, fields, options?)
```

- `key`: a string to look for inside the fields, or any other value to compare with `===`
- `fields`: a field name or an array of field names. Dotted paths such as `"user.name"` are always read as nested fields.
- `options.caseSensitive`: search is case sensitive unless this is `false`

String keys are matched literally: characters such as `+`, `.` or `(` have no special meaning. Missing fields and fields holding objects never match a string key, and numbers are matched by their text (`"19"` matches `19` and `190`).

Example data:

```js
const data = [
  { userId: 1, id: 3, title: "ea nesciunt repelut", body: "et iusto sed quo iure voluptatem occaecati" },
  { userId: 1, id: 4, title: "eum et est occaecati", body: "ullam et saepe voluptatem rerum illo velit" },
  { userId: 1, id: 5, title: "quas odio", body: "repudiandae veniam Nesciunt quaerat sunt sed" }
];
```

## One field

```js
search(data, "occaecati", "title");
```

Output:

```js
[
  { userId: 1, id: 4, title: "eum et est occaecati", body: "ullam et saepe voluptatem rerum illo velit" }
]
```

## Several fields

An item matches if any of the fields matches.

```js
search(data, "nesciunt", ["title", "body"]).map((item) => item.id);
```

Output:

```js
[3]
```

## Case insensitive

```js
search(data, "nesciunt", ["title", "body"], { caseSensitive: false }).map((item) => item.id);
```

Output:

```js
[3, 5]
```

## Non-string keys

Any other key is compared with `===`:

```js
search(data, 4, ["id", "userId"]).map((item) => item.id);
```

Output:

```js
[4]
```
