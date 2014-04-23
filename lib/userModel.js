"user strict";

var then = hi.module.then,
	redisClient = hi.lib.redis.client,
	crypto = hi.lib.crypto;

/*
 * SHA1 	使用SHA1加密
 * @param	str 	字符串
 * @param	encoding	编码方式，默认维hex
 * @return	SHA的hash
 */
function SHA1(str, encoding) {
	return crypto.createHash('sha1').update(str).digest(encoding || 'hex');
}

/* isLogin	注册用户
 * @param	callback
 * @param	username	用户名
 * @param	password	密码
 * @return	用户ID
 */
function isLogin(callback, username, password) {
	then(function(defer) {
		password = SHA1(password);
		redisClient.get("username.password.to.id:" + username + "." + password, defer);
	}).then(function(defer, userid) {
		if (userid) {
			callback(null, userid);
		} else {
			defer("登录失败");
		}
	}).fail(callback);
}

/* regUser	注册用户
 * @param	callback
 * @param	username	用户名
 * @param	password	密码（使用sha1加密）
 * @return	用户ID
 */
function regUser(callback, username, password) {
	then(function(defer) {
		// 检查用户名是否已经被注册
		redisClient.keys("username.password.to.id:" + username + ".*", defer);
	}).then(function(defer, ret) {
		// 获取当前userid
		if (ret && ret.length == 0) {
			redisClient.get("cur_userid", defer); //与之后的添加用户操作应合并为原子操作，否则可能有bug
		} else {
			defer("该用户名已注册");
		}
	}).then(function(defer, cur_userid) {
		if (cur_userid) {
			password = SHA1(password);
			var multi = redisClient.multi();
			multi.hmset("user:" + cur_userid, {
				username: username,
				password: password
			});
			multi.set("username.password.to.id:" + username + "." + password, cur_userid);
			multi.exec(function(err, value) {
				if (!err) {
					redisClient.incr("cur_userid");
					callback(null, cur_userid);
				} else {
					defer("系统错误");
				}
			});
		} else {
			defer("系统错误");
		}
	}).fail(callback);
}

module.exports = {
	isLogin: isLogin,
	regUser: regUser
};