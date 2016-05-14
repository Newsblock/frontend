/* jshint esnext:true, node:true */

const app = require('koa')();
const fetch = require('../lib/fetch')();

app.use(function * test() {
  const topvideo = yield fetch.fetchFrom('/topvideo', 'api');
  const cover = yield fetch.fetchFrom('cover_latest');

  this.body = { topvideo, cover };

  // yield * next;
});

// console.log('Goto: http://localhost:3000');
app.listen(3000);
