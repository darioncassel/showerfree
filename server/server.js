if (Meteor.isServer) {
  Showers = new Mongo.Collection("showers");
  Accounts.onLogin(function() {
    Meteor.publish("showers", function() {
      return Showers.find({});
    });
  });

  Meteor.methods({
    addShowers: function() {
      if (Showers.find().fetch().length == 0) {
        for(i=1;i<3;i++) {
          var shower = {
            "name": "shower " + i,
            "floor": 1,
            "occupied": false,
            "lock": null
          };
          Showers.insert(shower)
        }
        for(i=1;i<3;i++) {
          var shower = {
            "name": "shower " + i,
            "floor": 2,
            "occupied": false,
            "lock": null
          };
          Showers.insert(shower)
        }
      }
    },
    removeAll: function () {
      Showers.remove({});
    },
    updateShower: function(id, occupied, user) {
      Showers.update(id, {
        $set: {occupied: occupied, lock: user},
      });
    }
  });

  Meteor.startup(function () {
    if (Showers.find().fetch().length == 0) {
      for(i=1;i<3;i++) {
        var shower = {
          "name": "shower " + i,
          "floor": 1,
          "occupied": false,
          "lock": null
        };
        Showers.insert(shower)
      }
      for(i=1;i<3;i++) {
        var shower = {
          "name": "shower " + i,
          "floor": 2,
          "occupied": false,
          "lock": null
        };
        Showers.insert(shower)
      }
    }
  });

}