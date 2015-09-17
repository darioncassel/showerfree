if (Meteor.isClient) {
  Showers = new Mongo.Collection("showers")

	Meteor.subscribe("showers", function () {
    if (Meteor.cookie.get('username') == undefined || Meteor.cookie.get('username') == null) {
      user=randomString(10);
      var pass=randomString(10);
      Meteor.cookie.set('username', user)
      Meteor.cookie.set('password', pass)
      Accounts.createUser({username:user, password:pass});
    } else {
      user = Meteor.cookie.get('username');
      var pass = Meteor.cookie.get('password');
    }
    Meteor.loginWithPassword(user, pass);
  });

  Template.body.events({
    "click .toggle-occu": function () {
      var user = Meteor.cookie.get('username');
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
      var user = Meteor.cookie.get('username')
      if (user != this.lock && this.occupied) {
        return "disabled";
      }
    }
  })

  function randomString(num) {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for(var i=0;i<num;i++ ){
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}

}
