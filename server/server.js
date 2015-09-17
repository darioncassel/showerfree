if (Meteor.isServer) {
  Showers = new Mongo.Collection("showers");
  Accounts.onLogin(function() {
    Meteor.publish("showers", function() {
      return Showers.find({});
    });
  });

  Meteor.methods({
    removeAll: function () {
      Showers.remove({});
    },
    updateShower: function(id, occupied) {
      Showers.update(id, {
        $set: {occupied: occupied}
      });
    }
  });

  Meteor.startup(function () {
    if (Showers.find().fetch().length == 0) {
      for(i=1;i<3;i++) {
        var shower = {
          "name": "shower " + i,
          "floor": 1,
          "occupied": false
        };
        Showers.insert(shower)
      }
      for(i=1;i<3;i++) {
        var shower = {
          "name": "shower " + i,
          "floor": 2,
          "occupied": false
        };
        Showers.insert(shower)
      }
    }
  });

}
