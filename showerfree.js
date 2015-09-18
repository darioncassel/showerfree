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

	Meteor.subscribe("showers", function () {
    if (Meteor.cookie.get('username') == undefined || Meteor.cookie.get('username') == null) {
      user=randomString(10);
      var pass=randomString(10);
      Meteor.cookie.set('username', user, Infinity)
      Meteor.cookie.set('password', pass, Infinity)
      Meteor.cookie.set('canLock', true, Infinity)
      Accounts.createUser({username:user, password:pass});
    } else {
      if (Meteor.cookie.get('canLock') == undefined || Meteor.cookie.get('canLock') == null) {
        Meteor.cookie.set('canLock', true, Infinity)
      }
      user = Meteor.cookie.get('username');
      var pass = Meteor.cookie.get('password');
    }
    Meteor.loginWithPassword(user, pass);
  });

  Meteor.setInterval(function () {
    timeDep.changed();
  }, 60000);

  Template.body.events({
    "click .toggle-occu": function () {
      var user = Meteor.cookie.get('username');
      Meteor.cookie.set('canLock', this.occupied, Infinity);
      canLockDep.changed();
      Meteor.call("updateShower", this._id, !this.occupied, user)
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
    showers: function () {
      return Showers.find().fetch()
    }
  });

  Template.shower.helpers({
    disabled: function () {
      canLockDep.depend();
      var user = Meteor.cookie.get('username')
      var canLock = Meteor.cookie.get('canLock')
      if (user != this.lock && this.occupied || (canLock=="false" && this.lock != user)) {
        return "disabled";
      }
    },
    time : function () {
      timeDep.depend();
      return this.occupied ? moment(this.lockTime).from() : "";
    }
  });

}
