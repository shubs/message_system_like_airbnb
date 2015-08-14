var Hapi = require('hapi');
var Good = require('good');

var fb = require("./firebase");

var server = new Hapi.Server();
server.connection({ port: 3000 });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

// Messages

server.route({
    method: 'GET',
    path: '/message/',
    handler: function (request, reply) {
        fb.listMessages(function (list) {
            reply(list);
        });
    }
});

server.route({
    method: 'GET',
    path: '/message/{id}',
    handler: function (request, reply) {
        id = request.params.id;
        fb.viewMessage(id, function(message){
            reply(message);
        });
    }
});

server.route({
    method: 'DELETE',
    path: '/message/{id}',
    handler: function (request, reply) {
        id = request.params.id;
        fb.delMessage(id, function(confirmation){
            reply(confirmation);
        });
    }
});

// maybe internal
server.route({
    method: 'POST',
    path: '/message/',
    handler: function (request, reply) {
        body = request.payload;
        // Mendatory fields in message
        fb.addMessage(
            body.subject,
            body.content,
            body.date,
            body.fromId,
            body.toId,
            function(message){
                reply(message);
            }
        );
    }
});

// TODO faire en sorte que le mail arrive bien et soit mis dans la liste des messages via AddMessage.
server.route({
    method: 'POST',
    path: '/message/send/',
    handler: function (request, reply) {
        body = request.payload;
        fb.sendMessage(
            body.subject,
            body.content,
            body.fromId,
            body.toId,
            function(message){
                reply(message);
            }
        );
    }
});



server.route({
    method: 'POST',
    path: '/message/parse/',
    handler: function (request, reply) {
        body = request.payload;
        fb.receiveMessage(
            body.Headers.From,
            body.Headers.To,
            body.Subject,
            body.Headers.Date,
            body["Text-part"],
            function(message){
                reply(message);
            }
        );
    }
});


// Users

server.route({
    method: 'GET',
    path: '/user/',
    handler: function (request, reply) {
        fb.listUsers(function (list) {
            reply(list);
        });
    }
});

server.route({
    method: 'GET',
    path: '/user/{id}',
    handler: function (request, reply) {
        id = request.params.id;
        fb.viewUser(id, function(user){
            reply(user);
        });
    }
});

server.route({
    method: 'DELETE',
    path: '/user/{id}',
    handler: function (request, reply) {
        id = request.params.id;
        fb.delUser(id, function(confirmation){
            reply(confirmation);
        });
    }
});

server.route({
    method: 'POST',
    path: '/user/',
    handler: function (request, reply) {
        body = request.payload;
        // Mendatory fields in user :
        // firstName, lastName, email
        fb.addUser(
            body.firstName,
            body.lastName,
            body.email,
            function(user){
                reply(user);
            }
        );
    }
});

server.register({
    register: Good,
    options: {
        reporters: [{
            reporter: require('good-console'),
            events: {
                response: '*',
                log: '*'
            }
        }]
    }
}, function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});