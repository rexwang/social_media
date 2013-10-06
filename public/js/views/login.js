define(['SocialNetView', 'text!templates/login.html'], function (SocailNetView, loginTemplate) {

  var loginView = SocailNetView.extend({

    requireLogin: false,

    el: $('#content'),

    events: {
      'submit form': 'login'
    },

    initialize: function (options) {
      this.socketEvents = options.socketEvents;
    },

    login: function() {

      var socketEvents = this.socketEvents;

      $.post('/login', this.$('form').serialize(), function (data) {

        // When the user has a successful login attempt, the view an
        // app:loggedin event with socketEvent. This will send the 
        // text 'app:loggedin' to any object that has registered a
        // listener against the app:loggedin event using bind.
        socketEvents.trigger('app:loggedin');

        // Redirect to js/views/index.js
        window.location.hash = 'index';
      
      // If the login is a failure ( username and password don't authenticate
      // against any accounts ), some error messages will slide into view
      }).error(function() {
        $('#error').text('Unable to login');
        $('#error').slideDown();
      });
      
      return false;
    },

    render: function() {
      this.$el.html( loginTemplate );
      $('#error').hide();
      $('input[name=email]').focus();
    }
  });

  return loginView;
});
