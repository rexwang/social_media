/*
 * The bootstrapper object instantiates the global configuration and establishes module
 * dependencies. This is instantiated by Require.js when page is initally loaded.
 */

// First job, defining the paths to all of the dependencies used by the application
require.config({
  paths: {
    jQuery: '/js/libs/jquery',
    Underscore: '/js/libs/underscore',
    Backbone: '/js/libs/backbone',
    Sockets: '/socket.io/socket.io',
    models: 'models',

    // text RequireJS plugin allows you to read text content into your appliation,
    // provided they reside ( due to broswer security restrictions ) on the same 
    // domain as your Javascript code
    text: '/js/libs/text',

    templates: '../templates',
    SocialNetView: '/js/SocialNetView'
  },

  // The shim configures dependencies that use traditional browser globals
  // rather than the module export style of javascript used by RequireJS,
  // this section ensures that the required dependencies ( jquery, underscore )
  // are loaded before Backbone initializes, in order to prevent conficts from
  // parallel loading
  shim: {
    'Backbone': ['Underscore', 'jQuery'],
    'SocialNet': ['Backbone']
  }
});

// Second job, initailizing and launching the user interface
require(['SocialNet'], function(SocialNet) {
  SocialNet.initialize();
});
