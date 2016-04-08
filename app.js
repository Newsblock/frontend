/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
'use strict';
/* eslint no-shadow:0 *//* app is already declared in the upper scope */

const koa          = require('koa');               // Koa framework
const compose      = require('koa-compose');       // middleware composer
const compress     = require('koa-compress');      // HTTP compression
const responseTime = require('koa-response-time'); // X-Response-Time middleware

const app = module.exports = koa();

// return response time in X-Response-Time header
app.use(responseTime());

// HTTP compression
app.use(compress({}));

app.keys = ['newsblock-www'];

app.use(function* subApp() {
    yield compose(require('./app/config.js').middleware);
});

if (!module.parent) {
    /* eslint no-console: 0 */
    app.listen(process.env.PORT||3000);
    console.log(process.version+' listening on port '+(process.env.PORT||3000));
}
