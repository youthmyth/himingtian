var express = require('express'),
	path = require('path'),
	http = require('http'),
	domain = require('domain'),
	servDm = domain.create();

global.hi = {};

servDm.on('error', function(error) {
	delete error.domain;
	console.error(error);
});

servDm.run(function() {
	hi.app = express();
	hi.config = require('./config/config');
	hi.module = {};
	hi.module.then = require('thenjs');
	hi.lib = {};
	hi.lib.redis = require(hi.config.libRedisDir);
	hi.lib.crypto = require('crypto');

	hi.app.set('env', 'development');
	hi.app.set('port', hi.config.listenPort || 3000);
	hi.app.set('views', hi.config.tplDir);
	hi.app.set('view engine', hi.config.viewEngine);
	hi.app.use(express.logger('dev'));
	hi.app.use(express.json());
	hi.app.use(express.urlencoded());
	hi.app.use(express.methodOverride());
	hi.config.isSession &&
		(
		hi.app.use(express.cookieParser()),
		hi.app.use(express.session({
			secret: hi.config.sessionName
		}))
	);

	hi.app.use(express.static(hi.config.staticDir));
	hi.app.use(hi.app.router);

	var then = hi.module.then,
		redis = hi.lib.redis;

	if (process.argv.indexOf('install') > 0) {
		require('./lib/install.js')().then(function() {
			console.log('himingtian installed!');
			return process.exit(1);
		}).fail(function(defer, err){
			console.log(err);
			return process.exit(1);
		});
		return;
	}


	then(function(defer) {
		// 连接redis数据库
		redis.connect(defer);
	}).then(function(defer, client) {
		// 初始化各个model，且必须在注册路由之前
		hi.lib.redis.client = client;
		hi.lib.userModel = require(hi.config.userModelDir);
		hi.lib.noteModel = require(hi.config.noteModelDir);
		defer(null);
	}).then(function(defer) {
		hi.route = require(hi.config.cfgRouteDir);

		// 注册get路由
		then.each(hi.route.get, function(defer1, value1) {
			hi.app.get(value1.route, value1.controller);
		}).fail(defer);

		// 注册post路由
		then.each(hi.route.post, function(defer1, value1) {
			hi.app.post(value1.route, value1.controller);
		}).fail(defer);
		defer(null);
	}).then(function(defer) {
		hi.app.use(function(err, req, res, next) {
			if (!err) return next(); // you also need this line
			defer(err);
		});
		http.createServer(hi.app).listen(hi.app.get('port'), function() {
			console.log('Express server listening on port ' + hi.app.get('port'));
		});
	}).fail(function(defer, err) {
		console.error(err);
		redis.close();
		console.log("error and exit!");
		process.exit(1);
	});
});