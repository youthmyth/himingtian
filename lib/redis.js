'use strict';

var client,
	redis = require('redis'),
	redisPort = hi.config.redisPort,
	redisHost = hi.config.redisHost,
	then = hi.module.then;
// userModel = require(hi.config.userModelDir);

function connect(callback) {
	console.log('Connect to Redis...');
	then(function(defer) {
		client = redis.createClient(redisPort, redisHost, {
			connect_timeout: 5000
		}).on('ready', function() {
			client.select(0, defer);
		}).on('error', function(error) {
			defer(error);
		});
	}).all(function(defer, err) {
		if (!err) {
			console.log("Redis connected");
		}
		callback(err, client);
	});
}

function close() {
	client.end();
}

module.exports = {
	connect: connect,
	close: close
	// userModel: userModel
};