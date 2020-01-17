var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

const select = require('../dist/select').default;

module.exports = function () {
  const data = [{ a: 1, b: 2, c: 3 }];

  suite
    .add('Select, with-one-field', function () {
      select(data, "a");
    })
    .on('cycle', function (event) {
      console.log(String(event.target));
    })
    // .on('complete', function () {
    //   console.log('\nFastest is (' + this.filter('fastest').map('name') + ')');
    // })
    .run();
}