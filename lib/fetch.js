/* jshint esnext:true, node:true */
'use strict';
const request = require('koa-request');
const extend = require('extend');

module.exports = Fetch;

Fetch.defaults = {
  apiDomain: 'http://api.newsblock.io',
  apiVersion: '1',
  s3BaseUrl: 'https://s3.amazonaws.com/newsblock/json/',
  s3ObjectExt: '.json'
};

function Fetch(opts) {
  const options = extend({}, Fetch.defaults, opts);

  // auto-new instance
  if (!(this instanceof Fetch)) {
    return new Fetch(options);
  }

  this.s3BaseUrl = options.s3BaseUrl;
  this.s3ObjectExt = options.s3ObjectExt;
  this.apiBaseUrl = options.apiDomain + '/v' + options.apiVersion;
}

Fetch.prototype.fetchFrom = function *(key, src) {

  var self = this;
  let json = null;
  let source = src || 's3';
  let fetchUrl = self.s3BaseUrl + key + self.s3ObjectExt; // use S3 by default

  if (source === 'api') {
    fetchUrl = self.apiBaseUrl + key;
  }

  try {
    let response = yield request(fetchUrl);
    json = JSON.parse(response.body);
  }
  catch (e) {
    console.error(source, 'fetch:', e); // eslint-disable-line
  }
  return json;
};
