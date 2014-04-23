'use strict';

var path = require('path'),
	processPath = path.dirname(process.argv[1]);

module.exports = {
	listenPort: 3000, //监听端口
	baseDir: processPath,

	viewEngine: 'ejs',

	cfgBaseDir: processPath + '/config',
	cfgConfigDir: processPath + '/config/config',
	cfgRouteDir: processPath + '/config/route',

	libRedisDir: processPath + '/lib/redis',

	staticDir: processPath + '/public',
	tplDir: processPath + '/views',
	routeDir: processPath + '/routes',

	// Models
	userModelDir: processPath + '/lib/userModel',
	noteModelDir: processPath + '/lib/noteModel',

	//session设置
	isSession: true,
	sessionName: 'himingtian',

	//redis设置
	redisPort: 6379,
	redisHost: '127.0.0.1'
};