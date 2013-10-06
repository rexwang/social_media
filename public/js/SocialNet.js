/*
 * The main application class for the social network; this class handles the messaging
 * between views, controller, and models
 */

define(['router', 'SocialNetSockets', 'text!templates/header.html'], function (router, socket, headerTemplate) {

  var initialize = function() {
    socket.initialize( router.socketEvents );
    checkLogin( runApplication );
  };

  var checkLogin = function (callback) {
    $.ajax('/account/authenticated', {
      method: 'GET',
      success: function() {
        return callback( true );
      },
      error: function (data) {
        return callback( false );
      }
    });
  };

  var runApplication = function (authenticated) {
    if ( authenticated ) {
      router.socketEvents.trigger('app:loggedin');
      //this is for git testing.
      window.location.hash = 'index';
    } else {
      window.location.hash = 'login';
    }
    Backbone.history.start();
  };

  return {
    initialize: initialize
  };

});

