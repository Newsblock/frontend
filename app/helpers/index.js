const glob = require('glob');
const extend = require('extend');

var helpers = {};
// requires all the helpers
var files = glob.sync('*.js', {cwd:'app/helpers', ignore:'index.js'});

files.forEach(function (file) {
  extend(helpers, require('./'+file));
});

exports.config = function () {

  var customNames =  {
    link: helpers.linkHelper,
    'if-equal': helpers.ifEqual,
    'if-not-equal': helpers.ifNotEqual,
    'if-contains': helpers.ifContains,
    minsfromnow: helpers.minutesFromNow,
    'add-commas': helpers.addCommasToNumber,
    'json-string': helpers.jsonString,
    'if-gt': helpers.ifGt,
    'abbreviation-count': helpers.abbreviationCount,
    'key-count': helpers.keyCount,
    'if-has-keys': helpers.ifHasKeys,
    'each-limit': helpers.eachLimit,
    'each-slice': helpers.eachSlice,
    imgurl: helpers.imgUrl,
    'favicon-url': helpers.faviconUrl,
    'adaptImgUrl': helpers.adaptImgUrl,
    'publisher-url': helpers.publisherUrl,
    'datetime': helpers.datetime
  };

  return extend(helpers, customNames);
};
