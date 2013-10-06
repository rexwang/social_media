/*
** The class is intended to be initialized after the application's router
** and take the router's socketEvents object as the initialization parameter
** When the class is initialzed, the socketEvents object (called eventDispatcher here)
** is told to bind the app.loggedin event to the connectSocket function. 
*/
define(['Sockets', 'models/ContactCollection', 'views/chat'], function (sio, ContactCollection, ChatView) {

  // When the Socket.io server sends a chat event using the 'chatserver' event name
  // (indicating that the chat originated from the server), the SocialNetSockets class
  // will trigger two of its own events in the socketEvents dispatcher: socket:chat:start
  // and socket:chat:in. Whenever a chat message is received all interested observers will
  // know they need to start a session and process an incoming message.
  var SocialNetSockets = function (eventDispatcher) {

    var accountId = null;
    var socket = null;

    var connectSocket = function (socketAccountId) {

      accountId = socketAccountId;
      socket = io.connect();
      socket
        .on('connect_failed', function (reason) {
          console.error('Unable to connect', reason);
        })
        .on('connect', function () {

          // Immediately upon connecting, the eventDispatcher will bind to an event called
          // socket:chat. This will be triggered whenever the user sends a chat message to
          // any of his contacts.
          eventDispatcher.bind('socket:chat', sendChat);

          socket.on('chatserver', function (data) {
            eventDispatcher.trigger('socket:chat:start:' + data.from);
            eventDispatcher.trigger('socket:chat:in:' + data.from, data);
          });

          socket.on('contactEvent', handleContactEvent);

          var contactsCollection = new ContactCollection();
          contactsCollection.url = '/accounts/me/contacts';

          new ChatView({collection: contactsCollection, socketEvents: eventDispatcher}).render();

          contactsCollection.fetch({reset: true});
        });
    };

    var handleContactEvent = function(eventObj) {
      var eventName = eventObj.action + ':' + eventObj.from;
      eventDispatcher.trigger(eventName, eventObj);

      if ( eventObj.from == accountId ) {
        eventName = eventObj.action + ':me';
        eventDispatcher.trigger(eventName, eventObj);
      }
    };

    // When a chat is sent, the socket emits a chatclient event to the Socket.io server, indicating
    // the chat comes from the client.
    var sendChat = function (payload) {
      if ( socket != null ) {
        socket.emit('chatclient', payload);
      }
    };

    eventDispatcher.bind('app:loggedin', connectSocket)
  }

  return {
    initialize: function (eventDispatcher) {
      SocialNetSockets( eventDispatcher );
    }
  };
});