/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
'use strict';

const moment = require('moment-timezone');
const www = module.exports = {};
const lib = require('./../lib/lib');


www.index = function*() {
    try {
        const json = yield lib.fetch('/api/cover');
        var model = json;
        model.meta = this.state.meta;
        model.section = 'top stories';
        yield this.render('index', model);
    } catch (e) {
        this.throw(e);
    }
};

www.section = function*() {
    var section = this.params.section.toLowerCase();
    const json = yield lib.fetch('/api/'+section);
    var model = json;
    model.meta = lib.overrideMetaFor(this, 'section', json);
    model.section = section;
    yield this.render('index', model);
};

www.about = function*() {
    yield this.render('about', {section:'About Us'});
};


www.privacy = function*() {
    yield this.render('privacy', {section:'Privacy Policy'});
};


www.search = function*() {
    yield this.render('search', {section:'Search'});
};


www.archive = function*() {

    if(this.params.day) {
        const json = yield lib.fetch('/api/archive/'+ this.params.day);
        const model = json;
        model.meta = lib.overrideMetaFor(this,'archive', json);
        yield this.render('index', model);
    }
    else {
        const dates = lib.getDates('2016-04-03', moment().subtract(16, 'hours'));
        const model = {dates:dates};
        model.section = 'Archive';
        model. meta = lib.overrideMetaFor(this, 'archiveIndex');
        yield this.render('archive', model);
    }
};

www.story = function*(next) {

    try {
        const json = yield lib.fetch('/api/story/'+ this.params.storyid);
        const model = {story: json};

        model.meta = lib.overrideMetaFor(this, 'story', json);
        model.section = json.section;
        if(json.ampurl) {
            model.ampurl = json.ampurl.replace('http://','').replace('https://','');
        }

        //console.log('$$', model.meta);
        yield this.render('story', model);

    } catch (e) {
        console.log('### Error Logged ###');
        this.throw(e.status||500, e.message);
    }
};

www.video = function*(next) {

    try {
        const json = yield lib.fetch('/api/video/'+ this.params.videoid);
        const model = {video: json};

        model.meta = lib.overrideMetaFor(this, 'video', json);
        model.section = model.video.section;
        model.routepath = '/v/'+ model.video.videoId;

        //console.log('$$', model.meta);
        yield this.render('video', model);

    } catch (e) {
        console.log('### Error Logged ###');
        this.throw(e.status||500, e.message);
    }
};

www.publisher = function*(next) {
    const publisherDomain = this.params.publisher.toLowerCase();
    const json = yield lib.fetch('/api/publisher/'+publisherDomain);

    if(json.stories[0]) {
        json.meta = lib.overrideMetaFor(this, 'publisher', json);
        json.section = json.stories[0].publisher;
        yield this.render('index', json);
    }
    else {
        //logger.log('info',' /p route, no recent stories for:'+ publisherDomain);
        return next();
    }
};

/* other handlers for social automation */
www.topvideo = function*(next) {

    try {
        const json = yield lib.fetch('/api/topvideo');
        const model = {video: json};

        model.meta = lib.overrideMetaFor(this, 'video', json);
        model.section = model.video.section;
        model.routepath = '/v/'+ model.video.videoId;

        //console.log('$$', model.meta);
        yield this.render('video', model);

    } catch (e) {
        console.log('### Error Logged ###');
        this.throw(e.status||500, e.message);
    }
};

www.topstory = function*(next) {

    try {
        const json = yield lib.fetch('/api/lead/'+ this.params.section);
        const model = json;
        model.story.url = '/s/'+ model.story._id; // override destination URL
        model.meta = lib.overrideMetaFor(this, 'story', json);

        //console.log('$$', model.meta);
        yield this.render('story', model);

    } catch (e) {
        console.log('### Error Logged ###');
        this.throw(e.status||500, e.message);
    }
};
