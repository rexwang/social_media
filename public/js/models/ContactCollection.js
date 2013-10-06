define(['models/Contact'], function (Contact) {
  var ContactCollection = Backbone.Collection.extend({
    model: Contact
  });

  // For the other code use ContactCollection, we have to 
  // return it
  return ContactCollection;
});