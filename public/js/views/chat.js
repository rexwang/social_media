// This view will cantain a list of all of the connected user'
// contacts and keep him on screen at all times. During the renderCollection
// function, the list is redrawn, and for each contact the chat view binds the
// startChatSession callback on the chat:server event to handle cases when the
// user clicks on a particular contact's name.
define(['SocialNetView', 'views/chatsession', 'views/chatitem', 'text!templates/chat.html'],
function (SocialNetView, ChatSessionView, ChatItemView, ChatItemTemplate ) {

  var chatView = SocialNetView.extend({
    el: $('#chat'),

    // This is a dictionary - because the accountId is used as the key for
    // each session, it's kept easily accessible in memory, so checking for
    // the existence of a particular account in this object is a fast operation.
    chatSessions: {},

    initialize: function (options) {
      this.socketEvents = options.socketEvents;
      this.collection.on('reset', this.renderCollection, this);
    },

    render: function () {
      this.$el.html(ChatItemTemplate);
    },

    // This function checks to see whether a chat session already exists
    // between the user and the given contact. If a session does not already
    // exist, it will create one and add it to the chatSessions object.
    startChatSession: function (model) {
      var accountId = model.get('accountId');
      if ( !this.chatSessions[accountId] ) {
        var chatSessionView = new ChatSessionView({
          model: model,
          socketEvents: this.socketEvents
        });
        this.$el.prepend(chatSessionView.render().el);
        this.chatSessions[accountId] = chatSessionView;
      }
    },

    renderCollection: function (collection) {
      var that = this;
      $('.chat_list').empty();
      collection.each(function (contact) {
        var chatItemView = new ChatItemView({
          socketEvents: that.socketEvents,
          model: contact
        });
        chatItemView.bind('chat:start', that.startChatSession, that);
        var statusHtml = (chatItemView).render().el;
        $(statusHtml).appendTo('.chat_list');
      });
    }
  });

  return chatView;
});