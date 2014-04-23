/*
 * login-post & get
 */

"use strict";

var then = hi.module.then,
    userModel = hi.lib.userModel;

function login(req, res) {
    if (req.session.userid) {
        res.redirect('/');
    } else {
        res.render('login', {});
    }
}

function login_post(req, res) {
    then(function(defer) {
        userModel.isLogin(defer, req.body.username, req.body.password);
    }).then(function(defer, userid) {
        req.session.username = req.body.username;
        req.session.userid = userid;
        res.redirect('/');
    }).fail(function(defer, err) {
        console.error(err);
        res.send(err);
    });
};

function logout(req, res) {
    if (req.session.userid) {
        delete req.session.userid;
        delete req.session.username;
    }
    res.redirect('/');
}

function reg(req, res) {
    res.render('reg', {});
}

function reg_post(req, res) {
    then(function(defer) {
        userModel.regUser(defer, req.body.username, req.body.password);
    }).all(function(defer, err, value) {
        if (!err) {
            var userid = value;
            res.redirect('/login');
        } else {
            console.log(err);
            res.send(err);
        }
    }).fail(function(defer, err) {
        console.error(err);
    });
}

module.exports = {
    login: login,
    login_post: login_post,
    logout: logout,
    reg: reg,
    reg_post: reg_post
};