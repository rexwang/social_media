define(['SocialNetView', 'text!templates/chatsession.html'], function (SocialNetView, ChatItemTemplate) {

  var chatItemView = SocialNetView.extend({
    tagName: 'div',

    className: 'chat_session',

    $el: $(this.el),

    events: {
      'submit form': 'sendChat'
    },

    initialize: function (options) {
      this.socketEvents = options.socketEvents;
      this.socketEvents.on('socket:chat:in:' + this.model.get('accountId'), this.receiveChat, this);
    },

    receiveChat: function (data) {
      var chatLine = this.model.get('name').first + ': ' + data.text;
      this.$el.find('.chat_log').append($('<li>' + chatLine + '</li>'));
    },

    sendChat: function () {
      var chatText = this.$el.find('input[name=chat]').val();

      // Use regular expression to check whether or not the string was empty, or filled
      // with empty space
      // /[^\s]+/ translates to 'one or more characters that are not white space', the '[]'
      // cause the regular expression engine to check for a single character. The code \s
      // is a chracter class that matches white space characters. Putting a ^ in the first
      // position negates the expression. so [^\s] would mean 'a character that is NOT a white space'.
      if ( chatText && /[^\s]+/.test(chatText) ) {
        var chatLine = 'Me: ' + chatText;
        this.$el.find('.chat_log').append($('<li>' + chatLine + '</li>'));

        // emit a socket event 'socket:chat' to the contact's accountId, the chat message will get 
        // processed by the SocialNetSockets dispatcher and emitted to the server.
        this.socketEvents.trigger('socket:chat', {to: this.model.get('accountId'), text: chatText});
      }

      return false;
    },

    render: function () {
      this.$el.html(_.template(ChatItemTemplate, {model: this.model.toJSON()}));
      return this;
    }

  });

  return chatItemView;
});

