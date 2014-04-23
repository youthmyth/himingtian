"use strict";

var then = hi.module.then,
	noteModel = hi.lib.noteModel;

/*
 * 新增便笺
 */
function add(req, res) {
	if (req.session.userid) {
		then(function(defer) {
			noteModel.addNote(defer, req.session.userid, req.body.note);
		}).all(function(defer, err, value) {
			if (!err) {
				res.json({
					id: value
				});
			} else {
				res.json({
					id: 0,
					err: err
				});
			}
		});
	} else {
		res.json({
			id: 0
		});
	}
}

/*
 * 删除便笺
 */
function del(req, res) {
	if (req.session.userid) {
		then(function(defer) {
			noteModel.delNote(defer, req.session.userid, req.body.id);
		}).all(function(defer, err, value) {
			if (!err) {
				res.json({
					ret: value
				});
			}
		})
	} else {
		res.json({
			ret: 0
		});
	}
}

/*
 * 获取便笺
 */
function get(req, res) {
	if (req.session.userid) {
		then(function(defer) {
			noteModel.getNote(defer, req.session.userid);
		}).all(function(defer, err, val) {
			if (!err) {
				res.json({
					ret: 1,
					data: val
				});
			} else {
				res.json({
					ret: 0
				});
			}
		})
	} else {
		res.json({
			ret: 0
		});
	}
}


module.exports = {
	add: add,
	del: del,
	get: get
};