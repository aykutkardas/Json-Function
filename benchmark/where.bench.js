var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

const data = require('../test/test-data.json');

const where = require('../dist/package/where').default;

module.exports = function () {
  suite
    .add('Where, basic', function () {
      where(data, { userId: 1 });
    })
    .on('cycle', function (event) {
      console.log(String(event.target));
    })
    // .on('complete', function () {
    //   console.log('\nFastest is (' + this.filter('fastest').map('name') + ')');
    // })
    .run();
}