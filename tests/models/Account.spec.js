describe("Account model", function() {
  var nodemailer  = require('nodemailer');
  var mongoose    = require('mongoose');
  var config      = {
    mail: require('../../config/mail')
  };
  var accountModel = require('../../models/Account')(config, mongoose, nodemailer);

  describe("findByString method", function() {
    var callback = function () {
      console.log('callback function called');
    }
    var searchStr = 'testing string';

    it("should takes in two params, searchStr and callback", function() {
      expect(accountModel.findByString).toBeDefined();

      spyOn(accountModel, 'findByString');
      accountModel.findByString(searchStr, callback);
      expect(accountModel.findByString).toHaveBeenCalledWith(searchStr, callback);
    });

    it("should create a regular expression object base on the first params passed in.", function() {
      spyOn(accountModel, 'findByString').andCallFake(function (searchStr) {
        var searchRegex = new RegExp( searchStr, 'i' );
        expect( searchRegex ).toBeDefined();
        expect( typeof(searchRegex) ).toBe('object');
        expect( searchRegex ).toEqual( /testing string/i );
      });

      accountModel.findByString(searchStr, callback);
    });

    it("should use the regular expression to find account in database, and fires callback when it's done.", function() {
      expect(accountModel.Account).toBeDefined();

      var spyCallback = jasmine.createSpy('testingCallback');
      expect(spyCallback).not.toHaveBeenCalled();

      spyOn(accountModel, 'findByString').andCallFake(function (searchStr, spyCallback) {
        var searchRegex = new RegExp( searchStr, 'i' );
        expect(searchStr).toBe('rex.wangcongfei@gmail.com');

        accountModel.Account.db.collections.accounts.find({
          email: searchStr
          /*$or: [
            { 'name.full': { $regex: searchRegex } },
            { email:       { $regex: searchRegex } }
          ]*/
        }, function(err, doc) {
          spyCallback(doc);
        });
      });

      accountModel.findByString( 'rex.wangcongfei@gmail.com', spyCallback );

      waitsFor(function () {
        return spyCallback.callCount > 0;
      });

      runs(function () {
        console.log(spyCallback);
      });
    });
  });
});