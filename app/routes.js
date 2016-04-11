/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Routes: www app                                                                             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const router = require('koa-router')(); // router middleware for koa
const www = require('./handlers.js');

// parameterized routes
router.get( '/archive/:day(201[0-9]-[0-9]{2}-[0-9]{2})?', www.archive);
router.get( '/s/:storyid([0-9a-z]{24})', www.story);
router.get( '/v/:videoid',   www.video);
router.get( '/p/:publisher', www.publisher);


//static pages
router.get( '/about',   www.about);
router.get( '/privacy', www.privacy);
router.get( '/search',  www.search);


// pages for social automation
router.get( '/topvideo', www.topvideo);
router.get( '/lead/:section', www.topvideo);


// fronts
router.get( '/(|top)',  www.index);  // cover
router.get( '/:section([A-Za-z-]{2,40})',     www.section);


module.exports = router.middleware();

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
