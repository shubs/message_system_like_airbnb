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
    	ret = fb.listMessages();
        reply(ret);
    }
});

server.route({
    method: 'GET',
    path: '/message/{id}',
    handler: function (request, reply) {
    	id = request.params.id;
    	ret = fb.viewMessage(id);
        reply(ret);
    }
});

server.route({
    method: 'DELETE',
    path: '/message/{id}',
    handler: function (request, reply) {
    	id = request.params.id;
    	ret = fb.delMessage(id);
        reply(ret);
    }
});

server.route({
    method: 'POST',
    path: '/message/',
    handler: function (request, reply) {
    	body = request.payload;
    	// Mendatory fields in message :
    	// content, from, to
    	ret = fb.addMessage(
    		body.content,
    		body.from,
    		body.to
    		);
        reply(ret);
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