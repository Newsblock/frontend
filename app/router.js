/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Routes: www app                                                                             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';
var cache = require('koa-cache-lite');
var CACHE_TTL = 0;

if (process.env.NODE_ENV === 'production') {
  CACHE_TTL = 60 * 1000;
}
cache.configure({'/*': CACHE_TTL}, {debug: false});

const router = require('koa-router')(); // router middleware for koa
const controller = require('./controllers/index.js');

router.use(cache.middleware());

// parameterized routes
router.get('/archive/:day(201[0-9]-[0-9]{2}-[0-9]{2})?', controller.archive);
router.get('/s/:storyid([0-9a-z]{24})', controller.story);
router.get('/v/:videoid', controller.video);
router.get('/p/:publisher', controller.publisher);


//static pages
router.get('/about', controller.about);
router.get('/privacy', controller.privacy);
router.get('/search', controller.search);
router.get('/live', controller.live);

// pages for social automation
router.get('/topvideo', controller.topvideo);
router.get('/lead/:section', controller.topvideo);


// fronts
router.get('/(|top)', controller.index);  // cover
router.get('/:section([A-Za-z-]{2,40})', controller.section);


module.exports = router.middleware();

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
