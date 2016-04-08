/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const koa        = require('koa');            // koa framework
const handlebars = require('koa-handlebars'); // handlebars templating
const helmet     = require('koa-helmet');     // security header middleware
const serve      = require('koa-static');     // static file serving middleware
//const bunyan     = require('bunyan');         // logging
//const koaLogger  = require('koa-bunyan');     // logging

const app = module.exports = koa();

// logging
//const access = { type: 'rotating-file', path: './logs/www-access.log', level: 'trace', period: '1d', count: 4 };
//const error  = { type: 'rotating-file', path: './logs/www-error.log',  level: 'error', period: '1d', count: 4 };
//const logger = bunyan.createLogger({ name: 'www', streams: [ access, error ] });
//app.use(koaLogger(logger, {}));


// 500 status for thrown or uncaught exceptions anywhere down the line
app.use(function* handleErrors(next) {
    try {

        yield next;

    } catch (e) {
        this.status = e.status || 500;
        const context = app.env=='development' ? { e: e } : {};
        yield this.render('500-internal-server-error', context);
        this.app.emit('error', e, this); // github.com/koajs/examples/blob/master/errors/app.js
    }
});


// add the domain (host without subdomain) into koa ctx (referenced in navpartial template)
app.use(function* ctxAddDomain(next) {
    this.state.domain = this.host.replace('www.', '');
    yield next;
});

app.use(function* ctxSetMetaDefaults(next) {
    const metaData = {};
    //metaData.twitterLists = twitterLists;
    metaData.title = metaData.socialTitle = 'Latest News Headlines and Videos';
    metaData.summary = 'Newsblock combines ‘topic relevance’ and ‘social trends’ to recommend the best stories';
    metaData.image ='http://s3.amazonaws.com/newsblock/NB_ScreenShot2.png';
    this.state.meta = metaData;
    yield next;
});


// handlebars templating
app.use(handlebars({
    defaultLayout: 'main',
    extension:   ['html', 'handlebars'],
    viewsDir:    'app/views',
    partialsDir: 'app/views/partials',
    layoutsDir: 'app/views/layouts',
    helpers: require('./helpers').config()
}));


// helmet security headers
app.use(helmet());

// ------------ routing
// serve static files (html, css, js); allow browser to cache for 1 hour
app.use(serve('public', { maxage: 1000*60*60 }));
app.use(require('./routes.js'));


// end of the line: 404 status for any resource not found
app.use(function* notFound(next) {
    yield next; // actually no next...

    this.status = 404;
    yield this.render('404-not-found');
});
