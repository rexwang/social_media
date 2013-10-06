// This view is responsible for determining when a chat session should be created by detecting 
// when the user clicks on one of his contacts or when one of the contacts sends a message to the
// logged-in user.
define(['SocialNetView', 'text!templates/chatitem.html'], function (SocialNetView, ChatItemTemplate) {

  var chatItemView = SocialNetView.extend({
    tagName: 'li',

    $el: $(this.el),

    events: {
      'click': 'startChatSession'
    },

    // When the view is initialized, it binds to the socket's start event. This instructs Backbone to go
    // through the motions of starting a chat session whenever a chat is initiated from Socket.io.
    initialize: function (options) {
      var accountId = this.model.get('accountId');
      //options.socketEvents.bind('socket:chat:start:' + this.model.get('accountId'), this.startChatSession, this);
      options.socketEvents.bind(
        'login:' + accountId,
        this.handleContactLogin,
        this
      );
      options.socketEvents.bind(
        'logout:' + accountId,
        this.handleContactLogout,
        this
      );
      options.socketEvents.bind(
        'socket:chat:start:' + accountId,
        this.startChatSession,
        this
      );
    },

    handleContactLogin: function () {
      this.model.set('online', true);
      this.$el.find('.online_indicator').addClass('online');
    },

    handleContactLogout: function () {
      this.model.set('online', false);
      $onlineIndicator = this.$el.find('.online_indicator');
      while ( $onlineIndicator.hasClass('online') ) {
        $onlineIndicator.removeClass('online');
      }
    },

    // Whether the user clicks on a contact or the contact initiates a discussion with the user, the
    // same process for starting the chat on screen is put into motion.
    startChatSession: function () {
      this.trigger('chat:start', this.model);
    },

    render: function () {
      this.$el.html(_.template(ChatItemTemplate, {model: this.model.toJSON()}));

      if ( this.model.get('online') ) {
        this.handleContactLogin();
      }

      return this;
    }
  });

  return chatItemView;
});