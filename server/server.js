if (Meteor.isServer) {
  const SHOWER_TIMEOUT = 1000 * 60 * 44; // 44 minutes
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
            "name": "Shower " + i,
            "floor": 1,
            "occupied": false,
            "lock": null
          };
          Showers.insert(shower)
        }
        for(i=1;i<3;i++) {
          var shower = {
            "name": "Shower " + i,
            "floor": 2,
            "occupied": false,
            "lock": null
          };
          Showers.insert(shower)
        }
        for(i=1;i<3;i++) {
          var shower = {
            "name": "Shower " + i,
            "floor": 3,
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
    updateShower: function(id, occupied, user, callback) {
      var newlock = occupied ? user : null;
      Showers.update(id, {
        $set: {occupied: occupied, lock: newlock, lockTime: new Date()},
      });
      Meteor.setTimeout(function(){
        var thisShower = Showers.findOne(id);
        if(thisShower.occupied && thisShower.lock == user){
          Showers.update(id, {
            $set: {occupied: false, lock: null},
          });
        }
      }, SHOWER_TIMEOUT);
      return true;
    },
    updateUser: function(id, canLock) {
      Meteor.users.update(id, {
        $set: {'profile.canLock': canLock}
      });
    }
  });

  Meteor.startup(function () {
    if (Showers.find().fetch().length == 0) {
      for(i=1;i<3;i++) {
        var shower = {
          "name": "Shower " + i,
          "floor": 1,
          "occupied": false,
          "lock": null
        };
        Showers.insert(shower)
      }
      for(i=1;i<3;i++) {
        var shower = {
          "name": "Shower " + i,
          "floor": 2,
          "occupied": false,
          "lock": null
        };
        Showers.insert(shower)
      }
      for(i=1;i<3;i++) {
        var shower = {
          "name": "Shower " + i,
          "floor": 3,
          "occupied": false,
          "lock": null
        };
        Showers.insert(shower)
      }
    }
  });

}
