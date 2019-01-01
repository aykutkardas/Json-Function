# Active Record
**Full Size** *~5.292 kb*

## Install

```
yarn add active-record
```
```
npm install active-record
```

## Usage

### Full class
Example data
```js
const data = [
  {
    userId: 1,
    id: 1,
    title: "delectus aut autem",
    completed: false
  },
  {
    userId: 1,
    id: 2,
    title: "quis ut nam facilis et officia qui",
    completed: false
  },
  {
    userId: 1,
    id: 3,
    title: "fugiat veniam minus",
    completed: false
  },
  {
    userId: 1,
    id: 4,
    title: "et porro tempora",
    completed: true
  }
];
```
Chaining
```js
import ActiveRecord from 'active-record';

const result = ActiveRecord
      .where({ completed: false })
      .select(["title", "completed"])
      .orderBy("title", "DESC")
      .limit(2)
      .get(data);
```

or Standart

```js
import ActiveRecord from 'active-record';

ActiveRecord.where({ completed: false });
ActiveRecord.select(["title", "completed"]);
ActiveRecord.orderBy("title", "DESC");
ActiveRecord.limit(2);
const result = ActiveRecord.get(data);
```

Output
```js
[
  {
    title: "quis ut nam facilis et officia qui",
    completed: false
  },
  {
    title: "fugiat veniam minus",
    completed: false
  }
]
```

## Config
### resetRecord
```js
ActiveRecord.limit(2).get(data);
console.log(ActiveRecord.option.limit); // null
console.log(ActiveRecord.data); // []
```
```js
ActiveRecord.limit(2).get(data, { resetRecord: false });
console.log(ActiveRecord.option.limit); // [2, 0]
console.log(ActiveRecord.data); // [{..}, {..}]

// Manual Reset Method
ActiveRecord.reset();
```

# Methods
Instead of an entire "class", you can use only the methods you need.

## Where
**Size** *1.004 kb*
```js
import { Where } from 'active-record';

// Single
// (completed === false)
Where(data, { completed: false });

// Multiple (or)
// (completed === false || userId === 2)
Where(data, [{completed: false}, {userId: 2}]); 
```


## Select
**Size** *0,964 kb*
```js
import { Select } from 'active-record';

// Single
Select(data, "title");

// Multiple
Select(data, ["title", "completed"]); 
```

## Limit
**Size** *0.423 kb*
```js
import { Limit } from 'active-record';

// Limit
Limit(data, 2);

// Limit and Start
Limit(data, 2, 2); 
```

## OrderBy
**Size** *0.606 kb*
```js
import { OrderBy } from 'active-record';

OrderBy(data, "title", "DESC");
```