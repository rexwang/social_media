/*
** A status collection
*/

define(['models/status'], function (Status) {
  var StatusCollection = Backbone.Collection.extend({
    model: Status
  });

  return StatusCollection;
});