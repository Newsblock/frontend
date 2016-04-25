/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Routes: www app                                                                             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';
var cache = require('koa-cache-lite');
var CACHE_TTL = 0;
if(process.env.NODE_ENV ==='production') {
    CACHE_TTL = 60 * 1000;
}
cache.configure({'/*': CACHE_TTL}, {debug: false});

const router = require('koa-router')(); // router middleware for koa
const www = require('./handlers.js');

router.use(cache.middleware());

// parameterized routes
router.get( '/archive/:day(201[0-9]-[0-9]{2}-[0-9]{2})?', www.archive);
router.get( '/s/:storyid([0-9a-z]{24})', www.story);
router.get( '/v/:videoid',   www.video);
router.get( '/p/:publisher', www.publisher);


//static pages
router.get( '/about',   www.about);
router.get( '/privacy', www.privacy);
router.get( '/search',  www.search);
router.get( '/live',    www.live);

// pages for social automation
router.get( '/topvideo', www.topvideo);
router.get( '/lead/:section', www.topvideo);


// fronts
router.get( '/(|top)',  www.index);  // cover
router.get( '/:section([A-Za-z-]{2,40})',     www.section);


module.exports = router.middleware();

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
