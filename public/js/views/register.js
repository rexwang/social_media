define(['text!templates/register.html'], function( registerTemplate ) {
  var registerView = Backbone.View.extend({
    el: $('#content'),

    events: {
      'submit form': 'register'
    },

    register: function() {

      // Post request to Express backend, in app.js there should be
      // a request handler that handles '/register' post request
      $.post('/register', {
        firstName: $('input[name=firstName]').val(),
        lastName: $('input[name=lastName]').val(),
        email: $('input[name=email]').val(),
        password: $('input[name=password]').val()

      // If the post request succeed, Express server send data as response
      }, function (data) {
        console.log(data);
        window.location.hash = 'login';
      });

      // return false to disable the default form functionality, which
      // will trigger a page reload. We don't need to reload the page
      // because we have negotiated the server communication behind the
      // scenes using the post method
      return false;
    },

    render: function() {
      this.$el.html( registerTemplate );
    }
  });

  return registerView;
});
        
