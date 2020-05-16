var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

const select = require('../dist/package/select').default;
const where = require('../dist/package/where').default;

const data = require('../test/test-data.json');

(function () {
  suite
    .add("Select, [Single]", function () {
      select(data, "title");
    })
    .add("Where, [Multiple]", function () {
      where(data, { userId: 1 });
    })
    .on("cycle", function (event) {
      console.log(String(event.target));
    })
    .run();
})()