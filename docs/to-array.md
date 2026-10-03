# toArray

Turns an object of objects, such as a Firebase snapshot, into an array. Each key is stored in the item. [Back to the documentation](README.md)

```js
import { toArray } from "json-function";
```

```ts
toArray(data, options?)
```

- `options.key`: the field that holds each key, `"uid"` by default

An array of objects is returned as it is; anything else that is not an object returns `[]`.

Example data:

```js
const data = {
  SpahhfW88GEcnVEXBkSB: { name: "John" },
  kDdjXxZWZwzKfYOyLUkE: { name: "Mike" },
  yPND1ItYbQXgoBXIAsz8: { name: "Dan" }
};
```

## Default key

```js
toArray(data);
```

Output:

```js
[
  { uid: "SpahhfW88GEcnVEXBkSB", name: "John" },
  { uid: "kDdjXxZWZwzKfYOyLUkE", name: "Mike" },
  { uid: "yPND1ItYbQXgoBXIAsz8", name: "Dan" }
]
```

## Custom key

```js
toArray(data, { key: "_id_" });
```

Output:

```js
[
  { _id_: "SpahhfW88GEcnVEXBkSB", name: "John" },
  { _id_: "kDdjXxZWZwzKfYOyLUkE", name: "Mike" },
  { _id_: "yPND1ItYbQXgoBXIAsz8", name: "Dan" }
]
```
