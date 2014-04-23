/*
 * GET home page.
 */

exports.index = function(req, res) {
	if (req.session.userid)
		res.render('index', {
			isLogin: true,
			username: req.session.username
		});
	else
		res.render('index', {
			isLogin: false
		});
};