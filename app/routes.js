/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Routes: www app                                                                             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const router = require('koa-router')(); // router middleware for koa
const www = require('./handlers.js');

// parameterized routes
router.get( '/archive/:day?', www.archive);
router.get( '/s/:storyid',   www.story);
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
router.get( '/:section',     www.section);


module.exports = router.middleware();

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
