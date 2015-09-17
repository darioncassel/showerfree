if (Meteor.isClient) {
  Showers = new Mongo.Collection("showers")
  var user=randomString(10);
  var pass=randomString(10);
  Accounts.createUser({username:user, password:pass});
	Meteor.loginWithPassword(user, pass);
	Meteor.subscribe("showers");

  Template.body.events({
    "click .toggle-occu": function () {
      Meteor.call("updateShower", this._id, !this.occupied)
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

  function randomString(num) {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for(var i=0;i<num;i++ ){
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}

}
