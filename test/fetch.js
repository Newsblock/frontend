/* jshint esnext:true, node:true */
'use strict';
var app = require('koa')();

var fetch = require('../lib/fetch')();

app.use(function *() {
    const topvideo = yield fetch.fetchFrom('/topvideo','api');
    const cover = yield fetch.fetchFrom('cover_latest');
    this.body = {topvideo: topvideo, cover:cover };

    //yield * next;
});

console.log('Goto: http://localhost:3000');
app.listen(3000);
