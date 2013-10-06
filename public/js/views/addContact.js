/*
** The add friend form controller
*/

define(['SocialNetView', 'models/Contact', 'views/Contact', 'text!templates/addContact.html'], 
function (SocialNetView, Contact, ContactView, addContactTemplate) {
  var addContactView = SocialNetView.extend({
    el: $('#content'),

    events: {
      'submit form': 'search'
    },

    search: function () {

      // Doing this ensures that a reference to the Add Contact form is carried through
      // to the POST callback, otherwise you will not be able to call the view's render function
      var view = this;

      // The serialize() function turns the form fields supplied by the user into
      // a JSON array sent to the server, if Backbone receives a successful response,
      // it will re-render the view along with the search results
      $.post('/contacts/find', this.$('form').serialize(), function (data) {
        view.render(data);
      }).error(function() {
        $('#results').text('No contacts found.');
        $('#results').slideDown();
      });

      return false;
    },

    render: function (resultList) {
      var view = this;
      this.$el.html(_.template( addContactTemplate ));

      if ( resultList != null ) {
        _.each(resultList, function (contactJson) {
          var contactModel = new Contact(contactJson);
          var contactHtml = (new ContactView(
            { addButton: true, model: contactModel }
          )).render().el;

          $('#results').append(contactHtml);
        });
      }
    }
  });

  return addContactView;
});

