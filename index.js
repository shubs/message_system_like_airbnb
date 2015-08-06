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

server.route({
    method: 'POST',
    path: '/message/',
    handler: function (request, reply) {
    	body = request.payload;
    	// Mendatory fields in message :
    	// content, from, to
    	fb.addMessage(
    		body.content,
    		body.from,
    		body.to,
    		function(message){
    			reply(message);
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