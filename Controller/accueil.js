var express	= require('express');
var router	= express.Router();
var fs = require('fs');
/*
var tools   = require('./controllers_tools');
var message = require('../sql/requestMessage');
var connection	= require('../sql/requestPlayer');
var fs = require('fs');
ROUTER.GET('/', FUNCTION(REQ, RES) {
	GETMESSAGES(RES, REQ, UNDEFINED);
});*/

router.get('/', function(req, res) {
	//getMessages(res, req, undefined);
/*	
	res.render(page, parameters, function(err, result) {
    if(err){
      console.log(err);
    }
    res.render('template.html', merge_parameters(parameters, {contentBody : result}));
  });
*/
  var readStream = fs.createReadStream('./View/index.html');
  readStream.pipe(res);
});



/*

router.get('/sitemap.xml', function(req, res) {
    var readStream = fs.createReadStream('./sitemap.xml');
    readStream.pipe(res);
});

router.get('/robots.txt', function(req, res) {
    var readStream = fs.createReadStream('./robots.txt');
    readStream.pipe(res);
});

router.get('/index', function(req, res) {
	getMessages(res, req, undefined);
});

router.get('/index/:message', function(req, res) {
	getMessages(res, req, req.params.message);
});

function getMessages(res, req, params) {
	message.getMessageAdmin(function (messageAdmin) {
		message.getNews(function (news) {
			connection.getPlayersOnline(function (playersOnline){
				connection.getFriendsOnline(req.session.User, function (friendsOnline){
					tools.getPage(res, 'index.html', {User : req.session.User, MessageAdmin : messageAdmin, News: news, Message: params, PlayersOnline : playersOnline, FriendsOnline: friendsOnline});
				}, function() {
					tools.getPage(res, 'index.html', {User : req.session.User, MessageAdmin : messageAdmin, News: news, Message: params, PlayersOnline : playersOnline});
				});
			}, function() {
				tools.getPage(res, 'index.html', {User : req.session.User, MessageAdmin : messageAdmin, News: news, Message: params});
			});
		}, function() {
			tools.getPage(res, 'index.html', {User : req.session.User, MessageAdmin : messageAdmin, Message: params});
		});
	}, function() {
		tools.getPage(res, 'index.html', {User : req.session.User, Message: params});
	});
}
*/
/*function getPlayersOnline(res, req, params) {
	connection.getPlayersOnline(function (playersOnline){
		tools.getPage(res, 'index.html', {User : req.session.User, Name : playersOnline});
	});
}*/

module.exports = router;