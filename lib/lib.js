/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Library of assorted useful functions                                                          */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/* jshint esnext:true, node:true */
'use strict';

const Lib = module.exports = {};
const moment = require('moment-timezone');

/**
 * Log or notify unhandled exception.
 *
 * @param method
 * @param e
 */
Lib.logException = function logException(method, e) {
  /* eslint no-console: 0 */
  // could eg save to log file or e-mail developer
  console.log('UNHANDLED EXCEPTION', method, e.stack === undefined ? e.message : e.stack);
};

Lib.logError = function (method, e) {
  /* eslint no-console: 0 */
  console.log('Handled Error:', method, e.stack === undefined ? e.message : e.stack);
};


// TODO: possibly replace this with middleware
Lib.overrideMetaFor = function overrideMetaFor(ctx, metaType, json) {

  const meta = ctx.state.meta;

  if (metaType === 'story') {
    meta.title = meta.socialTitle = json.headline;
    meta.summary = json.summary;
    meta.image = json.image;
    return meta;
  }
  else if (metaType === 'video') {
    meta.title = meta.socialTitle = json.title + ' [video] ';
    meta.summary = json.title;
    const maxThumb = json.thumbnails.maxres || json.thumbnails.high;
    meta.image = maxThumb.url;
    return meta;
  }
  else if (metaType === 'section') {
    if (json.stories[0]) {
      meta.title = Lib.initialCap(json.stories[0].section) + ' News';
    }
    meta.socialTitle = meta.title;
    return meta;
  }
  else if (metaType === 'publisher') {
    if (json.stories[0]) {
      meta.title = 'Latest news from ' + json.stories[0].publisher;
    }
    meta.socialTitle = meta.title;
    meta.image = 'http://s3.amazonaws.com/newsblock/NB_publisher_page.png';
    return meta;
  }
  else if (metaType === 'archive') {
    meta.title = 'Top News for ' + json.section;
    meta.socialTitle = meta.title;
    return meta;
  }
  else if (metaType === 'archiveIndex') {
    meta.title = meta.socialTitle = 'Archive Index';
  }
  return meta;
};

Lib.getDates = function getDates(start, end) {
  const dateArray = [];
  let startDate = moment(start);
  const endDate = moment(end);
  let dayObject = {};
  while (startDate <= endDate) {
    dayObject = {
      key: moment(startDate).format('YYYY-MM-DD'),
      year: moment(startDate).format('YYYY'),
      month: moment(startDate).format('MM'),
      day: moment(startDate).format('DD')
    };
    dateArray.unshift(dayObject);
    startDate = moment(startDate).add(1, 'days');
  }
  return dateArray;
};

Lib.initialCap = function initialCap(string) {
  if (!string) {
    return '';
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};


Lib.twitterLists = function () {

  return [
    {id: '577288081600024577', title: 'world', slug: 'world'},
    {id: '577289232802295808', title: 'sports', slug: 'sports'},
    {id: '577288959451131904', title: 'politics', slug: 'politics'},
    {id: '577289509240500225', title: 'business', slug: 'business'},
    {id: '577289811159085056', title: 'technology', slug: 'technology'},
    {id: '577291479871275008', title: 'science', slug: 'science'},
    {id: '577290180354273280', title: 'entertainment', slug: 'entertainment'},
    {id: '577290438870175744', title: 'health', slug: 'health'},
    {id: '555719358534938626', title: 'topstories', slug: 'top'}, // because of story page hack
    {id: '555719358534938626', title: 'topstories', slug: 'About Us'},
    {id: '555719358534938626', title: 'topstories', slug: 'Privacy Policy'},
    {id: '555719358534938626', title: 'topstories', slug: 'Search'},
    {id: '555719358534938626', title: 'topstories', slug: 'nation'}, // because of video page hack
    {id: '555719358534938626', title: 'topstories', slug: 'top stories'}
  ];
};
