'use strict';

var index_route = require(hi.config.routeDir + '/index'),
	user_route = require(hi.config.routeDir + '/user'),
	note_route = require(hi.config.routeDir + '/note');

module.exports = {
	get: [{
		route: '/',
		controller: index_route.index
	}, {
		route: '/login',
		controller: user_route.login
	}, {
		route: '/logout',
		controller: user_route.logout
	}, {
		route: '/reg',
		controller: user_route.reg
	}],
	
	post: [{
		route: '/login',
		controller: user_route.login_post
	}, {
		route: '/reg',
		controller: user_route.reg_post
	}, {
		route: '/storage/note/add',
		controller: note_route.add
	}, {
		route: '/storage/note/del',
		controller: note_route.del
	}, {
		route: '/storage/note/get',
		controller: note_route.get
	}]
};