// firebase.js


var Firebase = require("firebase");
var db_message = new Firebase("https://reactmessage.firebaseio.com/message");
var db_user = new Firebase("https://reactmessage.firebaseio.com/user");
var async = require("async");
var lib = require("./lib.js");
var moment = require('moment');

////////////////////
// message functions //
////////////////////
myFunctions = {
	addMessage: function (subject, content, date, fromId, toId, callback) {
		id = Math.floor((Math.random() * 999999999) + 1);
		message = {
			id: id,
			subject: subject,
			content: content,
			date: date,
			fromId: fromId,
			toId:toId
		};

		db_message.child(id).set(message, function(error) {
			if (error) {
				callback({error : "[script error] Data could not be saved." + error});
			} else{
				callback(message);
			}
		});
	},
	delMessage: function (id, callback) {
		db_message.child(id).set(null, function(error) {
			if (error) {
				callback({error : "[script error] Data could not be deleted." + error});
			} else{
				callback({});
			}
		});
	},
	// callback ca marche comme ca en fait :O
	listMessages: function (callback) {
		list = {};

		db_message.once("value", function(snapshot) {
			list = snapshot.val();
			callback(list)
		}, function (errorObject) {
			callback({error : "The read failed: " + errorObject.code})
		});
	},
	viewMessage: function (id, callback) {
		message = {};

		db_message.child(id).once("value", function(snapshot) {
			message = snapshot.val();
			callback(message);
		}, function (errorObject) {
			callback({error : "The read failed: " + errorObject.code});
		});
	},

	////////////////////
	// User functions //
	////////////////////
	addUser: function (firstName, lastName, email, callback) {
		id = Math.floor((Math.random() * 999999999) + 1);
		user = {
			id: id,
			firstName: firstName,
			lastName: lastName,
			email:email,
			proxyEmail: 'aircnc+' + lib.randomString(34) + '@sharma.fr'
		};

		db_user.child(id).set(user, function(error) {
			if (error) {
				callback({error : "[script error] Data could not be saved." + error});
			} else{
				callback(user);
			}
		});
	},
	delUser: function (id, callback) {
		db_user.child(id).set(null, function(error) {
			if (error) {
				callback({error : "[script error] Data could not be deleted." + error});
			} else{
				callback({});
			}
		});
	},
	// callback ca marche comme ca en fait :O
	listUsers: function (callback) {
		list = {};

		db_user.once("value", function(snapshot) {
			list = snapshot.val();
			callback(list)
		}, function (errorObject) {
			callback({error : "The read failed: " + errorObject.code})
		});
	},
	viewUser: function (id, callback) {
		user = {};

		db_user.child(id).once("value", function(snapshot) {
			user = snapshot.val();
			callback(user);
		}, function (errorObject) {
			callback({error : "The read failed: " + errorObject.code});
		});
	},



	////////////////////
	// Core functions //
	////////////////////
	sendMessage: function(subject, content, fromId, toId, callback) {

		async.parallel([
			// getting the first async info
		    function(cb){
		        myFunctions.viewUser(toId, function(info){
		            cb(null, info.proxyEmail);
		        });
		    },
		    // and the second one
		    function(cb){
		        myFunctions.viewUser(fromId, function(info){
		            cb(null, info.proxyEmail);
		        });
		    }
		],
		function(err, results){
			// here compiling the 2 to send them to addMessage
		    var to = results[0];
		    var from = results[1];
		    var date = moment().format('MMMM Do YYYY, h:mm:ss a');

		    myFunctions.sendAPI(from, to, subject, content);
			myFunctions.addMessage(subject, content, date, fromId, toId, callback);
		});

	},
	receiveMessage: function (fromEmail, toEmail, subject, date, content, callback) {
		var fromId = "FIXME";
		var toId = "FIXME";
		// do the relation with Emails and Ids

		myFunctions.addMessage(subject, content, date, fromId, toId, callback);
	},
	
	////////////////////
	// Mailjet functions //
	////////////////////
	sendAPI : function(from, to, subject, text){
		console.log("[DEBUG] Send API " + from + to + subject + text);
	}
}

module.exports = myFunctions;
