// firebase.js

(function() {
	var Firebase = require("firebase");
	var db = new Firebase("https://reactmessage.firebaseio.com/message");

	module.exports = {
		addMessage: function (content, from, to) {
			id = Math.floor((Math.random() * 999999999) + 1);
			message = {
				id: id,
				content: content,
				from: from,
				to:to		
			};

			db.child(id).set(message, function(error) {
				if (error) {
					return({error : "Data could not be saved." + error});
					exit(1);
				}
			});

			return message;
		},
		delMessage: function (id) {
			db.child(id).set(null, function(error) {
				if (error) {
					return({error : "Data could not be deleted." + error});
					exit(1);
				}
			});
			return {};
		},
		listMessages: function () {
			list = {};
			db.on("value", function(snapshot) {
				list = snapshot.val();
			}, function (errorObject) {
				return({error : "The read failed: " + errorObject.code});
				exit(1);
			});
			return list;
		},
		viewMessage: function (id) {
			message = {};
			db.child(id).on("value", function(snapshot) {
				message = snapshot.val();
				console.log(id);
				console.log(message);
			}, function (errorObject) {
				return({error : "The read failed: " + errorObject.code});
				exit(1);
			});
			return message;
		}
	};


}());