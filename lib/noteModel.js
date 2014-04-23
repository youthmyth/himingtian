"use strict";

var then = hi.module.then,
	redisClient = hi.lib.redis.client;

/*
 * addNote	添加note
 * @param	callback
 * @param	userid		用户id
 * @param	note 		note内容
 * @return 	若添加成功，则返回noteid
 */
function addNote(callback, userid, note) {
	then(function(defer) {
		redisClient.get("cur_noteid", defer); //与之后的添加note操作应合并为原子操作，否则可能出现错误
	}).then(function(defer, noteid) {
		if (noteid) {
			var multi = redisClient.multi();
			multi.hmset("note:" + noteid, {
				id: noteid,
				data: note
			});
			multi.rpush("userid.to.noteid:" + userid, noteid);
			multi.exec(function(err, value) {
				if (!err) {
					redisClient.incr("cur_noteid");
					callback(null, noteid);
				} else {
					defer("系统错误");
				}
			});
		} else {
			defer("系统错误");
		}
	}).fail(callback);
}

/*
 * getNote	获取用户所有note
 * @param	callback
 * @param 	userid			用户id
 * @return	返回note的数组
 */
function getNote(callback, userid) {
	then(function(defer) {
		redisClient.lrange("userid.to.noteid:" + userid, 0, -1, defer);
	}).each(null, function(defer, noteid) {
		redisClient.hmget("note:" + noteid, ['id', 'data'], defer);
	}).then(function(defer, note) {
		var notes = [];
		note.forEach(function(val, index) {
			notes.push({
				id: val[0],
				data: val[1]
			});
		});
		defer(null, notes);
	}).all(callback);
}

/*
 * delNote
 * @param	callback
 * @param	userid		用户id
 * @param	noteid 		note的id
 * @return	成功返回1，否则0
 */
function delNote(callback, userid, noteid) {
	then(function(defer) {
		var multi = redisClient.multi();
		multi.del("note:" + noteid);
		multi.lrem("userid.to.noteid:" + userid, 1, noteid);
		multi.exec(function(err, value) {
			if (!err) {
				callback(null, true);
			} else {
				callback(null, false);
			}
		}).fail(callback);
	})
}

module.exports = {
	addNote: addNote,
	getNote: getNote,
	delNote: delNote
}