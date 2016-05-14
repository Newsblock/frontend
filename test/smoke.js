'use strict';
//const assert = require('assert');
require('co-mocha'); // so generators yield
const app = require('../app.js');
const request = require('co-supertest').agent(app.listen());


describe('smoke tests', function() {
  before(function(){

  });

  describe('cover: /', function () {

    it('should return 200 status', function *(){
      yield request.get('/').expect(200).end();
    });

  });

  describe('section: /world', function () {

    it('should return 200 status', function *(){
      yield request.get('/world').expect(200).end();
    });

  });

  describe('404: /bad-url', function () {

    it('should return 404 status', function *(){
      yield request.get('/bad-url').expect(404).end();
    });

  });

});
