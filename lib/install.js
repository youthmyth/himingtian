"use strict";

var then = hi.module.then,
	redis = hi.lib.redis,
	redisClient;

module.exports = function() {
	return then(function(defer) {
		redis.connect(defer);
	}).then(function(defer, client) {
		redisClient = client;
		redisClient.flushdb(defer);
		console.log("Redis db flushed");
	}).then(function(defer) {
		var multi = redisClient.multi();
		multi.set("cur_userid", 1);
		multi.set("cur_noteid", 1);
		multi.exec(defer);
	});
};