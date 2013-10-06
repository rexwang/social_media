describe("Testing app.js", function() {
  var request = require('request');
  var express = require('express');
  var http    = require('http');
  var app     = express();

  var options = {
    hostname: 'localhost:3000',
    port: 3000,
    path:'/accounts/:id/contact?contactId=123',
    method: 'POST'
  };

  it("should respond successfully", function(done) {
    request('http://localhost:3000/', function (error, res, body) {
      expect(res.statusCode).toEqual(200);
      done();
    });
  });

  it("should handle post request '/accounts/:id/contact?contactId=123'", function(done) {
    http.request( options, function (res) {
      expect(res.statusCode).toEqual(201);
      done();
    });
  });

  /*describe("app should have method get", function() {
    it("can handle get requests.", function(done) {
      app.get('/', function (req, res) {
        expect(req).toBeDefined();
        done();
      });
    });
  });*/
});