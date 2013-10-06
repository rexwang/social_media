/*
 * The default template shown to users when they arrive at the application; this view 
 * renders the content of the file located at public/templates/index.html
 */

define(['SocialNetView','text!templates/index.html', 'views/status', 'models/Status'], 
function(SocialNetView, indexTemplate, StatusView, Status) {

  var indexView = SocialNetView.extend({
    el: $('#content'),

    events: {
      'submit form': 'updateStatus'
    },

    initialize: function (options) {

      // Create navigation bar
/*      $('body').append('<div id="header"><span id="logout">Logout</span></div>');
      $( '#logout' ).hover(
        function() {
          $(this).css('color', '#E7D59F');
        }, function() {
          $(this).css('color', 'black');
        }
      );
      $('#logout').on('click', function (e) {
        $.get('/logout', function () {
          console.log('logout completed.');
          location.reload();
        });
      });
*/
      options.socketEvents.bind('status:me', this.onSocketStatusAdded, this );
      this.collection.on('add', this.onStatusAdded, this);
      this.collection.on('reset', this.onStatusCollectionReset, this);
    },

    // This function takes the incoming data payload coming in from Socket.io and convert
    // it to a Status model, then add it to the view's collection object. Because we already
    // have a 'onStatusAdded' function that handles rendering the new status and displaying
    // it on screen, so this function only need to create a Status and throw it at the collection,
    // and not worry about the work of displaying the status to users.
    onSocketStatusAdded: function (data) {
      var newStatus = data.data;
      var found = false;
      this.collection.forEach(function (status) {
        var name = status.get('name');
        if ( name && name.full == newStatus.name.full && status.get('status') == newStatus.status ) {
          found = true;
        }
      });

      if ( !found ) {
        this.collection.add( new Status({status: newStatus.status, name: newStatus.name}) )
      }
    },

    onStatusCollectionReset: function (collection) {
      var that = this;
      collection.each(function(model) {
        that.onStatusAdded(model);
      });
    },

    // To create an HTML representation of the status and prepend it to the list
    // of statues, which have already been rendered
    onStatusAdded: function (status) {
      var statusHtml = (new StatusView({ model: status })).render().el;

      while ( $('.status_list').children().length > 10 ) {
        $('.status_list li:last').remove();
      }
      
      $(statusHtml).prependTo('.status_list').hide().fadeIn('slow');
    },

    // Collects the information supplied by the user, posts it to the 
    // Express backend, generates a new status object, and add it to the 
    // view's collection object
    updateStatus: function () {
      var statusText = $('input[name=status]').val();
      var statusCollection = this.collection;
      $.post('/accounts/me/status', {
        status: statusText
      }, function (data) {
        statusCollection.add( new Status( {status: statusText} ) );
      });

      return false;
    },

    render: function() {
      this.$el.html(indexTemplate);
    }
  });

  return indexView;
});
