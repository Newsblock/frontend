/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Library of assorted useful functions                                                          */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/* jshint esnext:true, node:true */
'use strict';

const Lib = module.exports = {};
const baseUrl='http://api.newsblock.io';
const request = require('koa-request');
const moment = require('moment-timezone');

/**
 * Log or notify unhandled exception.
 *
 * @param method
 * @param e
 */
Lib.logException = function(method, e) {
    /* eslint no-console: 0 */
    // could eg save to log file or e-mail developer
    console.log('UNHANDLED EXCEPTION', method, e.stack===undefined?e.message:e.stack);
};

Lib.fetch = function *fetch(path) {
    let response = yield request(baseUrl+ path);
    return JSON.parse(response.body);
};

// TODO: possibly replace this with middleware
Lib.overrideMetaFor = function overrideMetaFor(ctx, metaType, json) {

    let meta = ctx.state.meta;

    if(metaType === 'story') {
        meta.title = meta.socialTitle = json.headline;
        meta.summary = json.summary;
        meta.image = json.image;
        return meta;
    }
    else if(metaType === 'video') {
        meta.title = meta.socialTitle = json.title + ' [video] ';
        meta.summary = json.title;
        let maxThumb = json.thumbnails.maxres || json.thumbnails.high;
        meta.image = maxThumb.url;
        return meta;
    }
    else if(metaType === 'section') {
        if(json.stories[0]) {
            meta.title = Lib.initialCap(json.stories[0].section) + ' News';
        }
        meta.socialTitle = meta.title;
        return meta;
    }
    else if (metaType === 'publisher') {
        if(json.stories[0]) {
            meta.title = 'Latest news from '+ json.stories[0].publisher;
        }
        meta.socialTitle = meta.title;
        meta.image ='http://s3.amazonaws.com/newsblock/NB_publisher_page.png';
        return meta;
    }
    else if (metaType === 'archive') {
        meta.title = 'Top News for '+ json.section;
        meta.socialTitle = meta.title;
        return meta;
    }
    else if (metaType === 'archiveIndex') {
        meta.title =  meta.socialTitle = 'Archive Index';
    }
    return meta;
};

Lib.getDates = function getDates(start, end) {
    var dateArray = [];
    var startDate = moment(start);
    var endDate = moment(end);
    while (startDate <= endDate) {
        var dayObject = {
            key:moment(startDate).format('YYYY-MM-DD'),
            year:moment(startDate).format('YYYY'),
            month: moment(startDate).format('MM'),
            day:moment(startDate).format('DD')
        };
        dateArray.unshift(dayObject);
        startDate = moment(startDate).add(1, 'days');
    }
    return dateArray;
};

Lib.initialCap = function initialCap(string) {
    if(!string) {
        return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
};

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
