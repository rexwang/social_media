define(['views/index', 'views/register', 'views/login', 'views/forgotPassword', 'views/profile', 'models/Account', 'models/StatusCollection', 'models/ContactCollection', 'views/contacts', 'views/addContact'],
  function (IndexView, RegisterView, LoginView, ForgotPasswordView, ProfileView, Account, StatusCollection, ContactCollection, ContactsView, AddContactView) {
    var SocialRouter = Backbone.Router.extend({
      currentView: null,

      // A global event dispatcher, this will create a standalone event object
      // which can be used independently of views.
      socketEvents: _.extend({}, Backbone.Events),
      
      routes: {
        'index': 'index',
        'login': 'login',
        'register': 'register',
        'forgotPassword': 'forgotPassword',
        'profile/:id': 'profile',
        'contacts/:id': 'contacts',
        'addContact': 'addContact'
      },

      // This function does the actual work of display each view by calling its 
      // render function. When a view is changed, the old view ( currentView )
      // is told to stop listening to web page events through the undelegateEvents
      // method. If you don't unhook the listeners when changing the views, 
      // your old view will remain in memory and continue to react to user events,
      // becoming so-called zombie functions.
      changeView: function (view) {
        if ( this.currentView != null ) {
          this.currentView.undelegateEvents();
        }
        this.currentView = view;

        // This is important, it calls the render function of Backbone.View, which
        // loads in view templates
        this.currentView.render();
      },

      index: function () {
        var statusCollection = new StatusCollection();
        statusCollection.url = '/accounts/me/activity';

        this.changeView( new IndexView({
          collection: statusCollection,
          socketEvents: this.socketEvents
        }));

        statusCollection.fetch();
      },

      login: function () {
        this.changeView( new LoginView( { socketEvents:this.socketEvents } ) );
      },

      forgotPassword: function () {
        this.changeView( new ForgotPasswordView() );
      },

      register: function () {
        this.changeView( new RegisterView() );
      },

      profile: function(id) {
        var model = new Account({id:id});
        var profileView = new ProfileView( {model:model, socketEvents: this.socketEvents} );
        model.fetch();
        /*var that = this;
        model.status.fetch({
          success: function () {
            that.changeView(new ProfileView({model:model.status}));
          }
        });*/
      },

      contacts: function (id) {
        var contactId = id ? id : 'me';
        var contactCollection = new ContactCollection();
        contactCollection.url = '/accounts/' + contactId + '/contacts';
        this.changeView(new ContactsView({
          collection: contactCollection
        }));
        /*contactCollection.fetch({
          success: function(data) {
            contactCollection.trigger('reset');
          }
        });*/

        contactCollection.fetch({reset:true});
      },

      addContact: function() {
        this.changeView(new AddContactView());
      }
    });

    return new SocialRouter();
  });
