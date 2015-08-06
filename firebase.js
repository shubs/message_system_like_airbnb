// firebase.js

(function() {
	var Firebase = require("firebase");
	var db = new Firebase("https://reactmessage.firebaseio.com/message");
	var async = require("async");

	module.exports = {
		addMessage: function (content, from, to, callback) {
			id = Math.floor((Math.random() * 999999999) + 1);
			message = {
				id: id,
				content: content,
				from: from,
				to:to		
			};

			db.child(id).set(message, function(error) {
				if (error) {
					callback({error : "Data could not be saved." + error});
				} else{
					callback(message);
				}
			});

			return message;
		},
		delMessage: function (id, callback) {
			db.child(id).set(null, function(error) {
				if (error) {
					callback({error : "Data could not be deleted." + error});
				} else{
					callback({});
				}
			});
			return {};
		},
		// callback ca marche comme ca en fait :O
		listMessages: function (callback) {
			list = {};

			db.on("value", function(snapshot) {
				list = snapshot.val();
				callback(list)
			}, function (errorObject) {
				callback({error : "The read failed: " + errorObject.code})
			});
		},
		viewMessage: function (id, callback) {
			message = {};

			db.child(id).on("value", function(snapshot) {
				message = snapshot.val();
				callback(message);
			}, function (errorObject) {
				callback({error : "The read failed: " + errorObject.code});
			});
		}
	};


}());