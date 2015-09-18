function randomString(num) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i=0;i<num;i++ ){
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

if (Meteor.isClient) {
  Showers = new Mongo.Collection("showers")

  var timeDep = new Tracker.Dependency;
  var canLockDep = new Tracker.Dependency;

	Meteor.subscribe("showers")

  Meteor.setInterval(function () {
    timeDep.changed();
  }, 60000);

  Template.body.onRendered(function () {
    var user = Meteor.cookie.get('username');
    var pass = Meteor.cookie.get('password');
    if (user == undefined || user == null) {
      user = randomString(10);
      pass = randomString(10);
      Meteor.cookie.set('username', user, Infinity)
      Meteor.cookie.set('password', pass, Infinity)
      Accounts.createUser({username:user, password:pass, profile: {canLock: true}});
    } else if (!Meteor.users.findOne({username: user})) {
      Accounts.createUser({username:user, password:pass, profile: {canLock: true}});
    }
    Meteor.loginWithPassword(user, pass, function(error) {
      canLockDep.changed();
      if (error) {
        mixpanel.track("Error: " + error);
      }
    });
  });

  Template.body.events({
    "click .toggle-occu": function () {
      var user = Meteor.cookie.get('username');
      Meteor.call('updateUser', Meteor.user()._id, this.occupied, function (error) {
        canLockDep.changed();
        if (error) {
          console.log(error)
          mixpanel.track("Error: " + error);
        }
      });
      Meteor.call("updateShower", this._id, !this.occupied, user, function(error, data){
        if (!error) {
          var temp = [this._id];
          temp.push(this.name);
          temp.push("floor"+this.floor);
          temp.push(this.occupied ? "start" : "end");
          temp.push(user);
          mixpanel.track(temp.join(","));
        } else {
          mixpanel.track("Error: " + error)
        }
      });
    }
  });

  Template.body.helpers({
    isOne: function (number) {
      if (number==1) {
        return true
      }
    },
    isTwo: function (number) {
      if (number==2) {
        return true
      }
    },
    isThree: function (number) {
      if (number==3) {
        return true
      }
    },
    showers: function () {
      return Showers.find().fetch()
    }
  });

  Template.shower.helpers({
    disabled: function () {
      canLockDep.depend();
      var user = Meteor.cookie.get('username')
      var canLock = Meteor.user().profile.canLock
      if ((user != this.lock && this.occupied) || (!canLock && this.lock != user)) {
        console.log("disabled");
        return "disabled";
      }
    },
    time : function () {
      timeDep.depend();
      return this.occupied ? moment(this.lockTime).from() : "";
    }
  });

}
