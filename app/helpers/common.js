'use strict';
const moment = require('moment-timezone');
const typogr = require('typogr');

exports.linkHelper = function (text, url) {
  return "<a href='" + url + "'>" + text + "</a>";
};

exports.sectionList = function () {
  return 'world|sports|politics|business|technology|science|entertainment|health|music|philly|seattle|new-york';
};

exports.faviconUrl = function (domain) {
  var host = 'na';
  if (domain) {
    host = domain.replace('http://', '');
  }
  return '//icons.duckduckgo.com/ip2/' + host + '.ico';
};

exports.publisherUrl = function (domain) {
  var host = 'na';
  if (domain) {
    host = domain.replace('http://www.', '').replace('http://', '').replace('https://www.', '').replace('https://', '');
  }
  return '/p/' + host;
};

exports.imgUrl = function (story) {
  let url = story.image;
  if (!story) {
    console.log('## imgUrl helper: story undefined'); // eslint-disable-line
    return '';
  }

  if (story.importedImg) {
    url = '//cdn.getnewsblock.com/images/' + story._id;
  }
  return url;
};

exports.adaptImgUrl = function (url, width, height) {
  var gUrl = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url=' + url
    + '&container=focus&refresh=2592000&resize_w=' + width;

  if (typeof height === 'number') {
    gUrl += '&resize_h=' + height;
  }
  return gUrl;
};

exports.ifindexby = function (num, divider, options) {
  if ((num + 1) % divider === 0) {
    return options.fn(this);
  }
  return options.inverse(this);
};

exports.plusone = function (num) {
  try {
    return num + 1;
  }
  catch (e) {
    console.warn('plusone', e); // eslint-disable-line
  }
  return 1;
};

exports.ifEqual = function (val, test, options) {

  if (typeof test === 'undefined') {
    return options.inverse(this);
  }

  if (typeof test === 'number' || typeof test === 'boolean') {
    if (val === test) {
      return options.fn(this);
    }
    else {
      return options.inverse(this);
    }
  }

  let arrTest = test.split('||');

  for (let i = 0; i < arrTest.length; i++) {
    if (val === arrTest[i]) {
      return options.fn(this);
    }
  }
  return options.inverse(this);
};

exports.ifNotEqual = function (val, test, options) {

  if (typeof test === 'undefined') {
    return options.inverse(this);
  }

  if (typeof test === 'number' || typeof test === 'boolean') {
    if (val !== test) {
      return options.fn(this);
    }
    else {
      return options.inverse(this);
    }
  }

  let arrTest = test.split('||');

  for (let i = 0; i < arrTest.length; i++) {
    if (val !== arrTest[i]) {
      return options.fn(this);
    }
  }
  return options.inverse(this);
};

exports.ifContains = function (val, test, options) {

  if (val && val.indexOf(test) > -1) {
    return options.fn(this);
  }
  else {
    return options.inverse(this);
  }
};

exports.decodeuri = function (value) {
  return decodeURIComponent(value);
};

exports.decodehtml = function (html) {
  return html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#039;/g, "'");
};

exports.archivedate = function (datevalue) {
  return moment(datevalue).format('MMMM Do, YYYY');
};

exports.minutesFromNow = function (datevalue) {
  var r = Math.floor((+new Date() - (+datevalue)) / 60000);
  return r;// + ' min' + ((r===1) ? '' : 's') + ' ago';
};

exports.formatdate = function (datevalue) {
  moment.updateLocale('en', {
    relativeTime: {future: "in %s", past: "%s ago", s: "s",
      m: "am", mm: "%dm", h: "1h", hh: "%dh", d: "1d", dd: "%dd",
      M: "amon", MM: "%dmon", y: "a y", yy: "%d y"
    }
  });
  return moment.utc(datevalue).fromNow();
};

exports.datetime = function (datevalue) {
  return moment.utc(datevalue).format();
};

//limit an each interation
//https://github.com/diy/handlebars-helpers/blob/master/lib/each-limit.js
exports.eachLimit = function (context, limit) {
  var options = arguments[arguments.length - 1];
  var ret = '';

  if (context && context.length > 0) {
    let max = Math.min(context.length, limit);
    for (let i = 0; i < max; i++) {
      ret += options.fn(context[i]);
    }
  } else {
    ret = options.inverse(this);
  }

  return ret;
};

// usage: {{#each-slice items 1 5}} like array.slice(1,5)
exports.eachSlice = function (context, offset, limit) {
  if (!context) {
    return null;
  }

  let options = arguments[arguments.length - 1];
  let ret = '',
    i = (offset < context.length) ? offset : 0,
    j = ((limit + offset) < context.length) ? (limit + offset) : context.length;

  for (i, j; i < j; i++) {
    ret += options.fn(context[i]);
  }

  return ret;
};

/**
 * If Greater-Than Helper. Renders the block when of the second
 * argument is greater than the first.
 * Reads as: ifGt a: 5? Is 5 greater than a? If so, render content.
 * {{#if-gt a 5}} content {{/if-gt}}
 */
exports.ifGt = function (a, b) {
  var options = arguments[arguments.length - 1];
  if (a > b) {
    return options.fn(this);
  }
  else {
    return options.inverse(this);
  }
};


//helps with finding percentage-based widths
exports.percentage = function (value, total) {

  if (!total) {
    total = 100;
  }

  return ( ( value / total ) * 100 );
};

//adds commas to numbers, including those with decimal values
exports.addCommasToNumber = function (x) {
  if (!x) {
    return null;
  }
  let parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

// A helper to render JSON data in the view templates
// Usage: {{{ json-stringify object }}}
exports.jsonString = function (obj) {
  obj = obj || {};
  return JSON.stringify(obj);
};

// Block helper to imitate layout block functionality
// Usage: put {{{ block 'nameOfTheBlock' }}} in the layout
exports.block = function (name) {
  var blocks = this._blocks;
  var content = blocks && blocks[name];
  return content ? content.join('\n') : null;
};

/*  contentFor helper to inject content into a block
 Usage example : put it like this in the desired hbs view template:

 {{#contentFor "nameOfTheBlock"}}
 <script>
 // hey, this is a script specific to this view template
 </script>
 {{/contentFor}}
 */
exports.contentFor = function (name, options) {
  var blocks = this._blocks || (this._blocks = {});
  var block = blocks[name] || (blocks[name] = []); //Changed this to [] instead of {}
  block.push(options.fn(this));
};

//tweaked this: https://github.com/diy/handlebars-helpers/blob/master/lib/abbr-count.js
exports.abbreviationCount = function (val, count) {

  if (!val || typeof val !== 'string') {
    return null;
  }

  if (!count) {
    count = 1;
  }
  return val.substring(0, count);

};

exports.keyCount = function (obj) {
  return Object.keys(obj).length;
};

exports.ifHasKeys = function (obj) {
  var options = arguments[arguments.length - 1];
  if (Object.keys(obj).length > 0) {
    return options.fn(this);
  }
  else {
    return options.inverse(this);
  }
};

exports.roundThousands = function (num) {
  return Math.round(num / 1000) + 'k';
};

exports.typogrFormat = function(val) {
  return typogr.smartypants(val);
};

exports.assetPath = function (path) {

  if (process.env.NODE_ENV !== 'production') {
    return path;
  }

  try {
    var revManifest = require('../../dist/rev-manifest.json');
    return revManifest[path];
  }
  catch (ex) {
    return path;
  }
};

exports.cssPath = function (path) {

  if (process.env.NODE_ENV !== 'production') {
    return path;
  }

  try {
    var revManifest = require('../../dist/css-manifest.json');
    return revManifest[path];
  }
  catch (ex) {
    return path;
  }
};
