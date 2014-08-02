express = require("express");
mongo = require('mongodb');
Server = mongo.Server;
Db = mongo.Db;



var server = new Server('127.0.0.1', 27017, {auto_reconnect: true});
var db = new Db('demo', server, {safe:false});

const KEY = 'express.sid'
, SECRET = '1234567890QWERTY';

var parseCookie = express.cookieParser(SECRET);
var MemoryStore = express.session.MemoryStore;
var store = new MemoryStore();

var app = express();

var port = 3000;
var fs = require('fs');
function include(file_) {
	with (global) {
		eval(fs.readFileSync(file_) + '');
	};
};

db.open(function(err, db) {
	db = db;
});

include(__dirname + '/libs/class.js');
include(__dirname + '/libs/controller.js');
include(__dirname + '/libs/model.js');
include(__dirname + '/libs/auth.js');

app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
app.configure(function () {
	app.use(express.cookieParser());
	app.use(express.session({store: store, secret: SECRET, key: KEY}));
});
app.use(function(req,res,next){
	req.db = db;
	next();
});


var controllerFolder = "/controllers/";

app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.engine(	'jade', require('jade').__express);

app.all("/", function(req, res){
	controller = "home";
	try{
		var classController = require(__dirname + controllerFolder + controller +".js");
		var control = new classController(req, res);
		return control.index();
	}
	catch(err){
		console.log(err.message, err.stack);
		res.render("error", {code: "404"});
	}
});

app.all("/:controller", function(req, res){
	var controller = req.params.controller;
	if(controller == undefined || controller == "/" || controller == ""){
		controller = "home";
	}
	try{
		var classController = require(__dirname + controllerFolder + controller +".js");
		var control = new classController(req, res);
		return control.index();
	}
	catch(err){
		console.log(err.message, err.stack);
		res.render("error", {code: "404"});
	}
});

app.all("/:controller/:action", function(req, res){
	var controller = req.params.controller;
	var action = req.params.action;
	console.log(controller, action);
	
	if(controller == undefined || controller == "/" || controller == ""){
		controller = "home";
	}
	try{
		var classController = require(__dirname + controllerFolder + controller +".js");
		var control = new classController(req, res);
		return control[action]();
	}
	catch(err){
		console.log(err.message, err.stack);
		res.render("error", {code: "404"});
	}
});

app.all("/:controller/:action/:id", function(req, res){
	var controller = req.params.controller;
	var action = req.params.action;
	
	if(controller == undefined || controller == "/" || controller == ""){
		controller = "home";
	}
	try{
		var classController = require(__dirname + controllerFolder + controller +".js");
		var control = new classController(req, res);
		return control[action]();
	}
	catch(err){
		console.log(err.message, err.stack);
		res.render("error", {code: "404"});
	}
});


var io = require('socket.io').listen(app.listen(port));


io.set('authorization', function(handshake, callback) {
	if (handshake.headers.cookie) {
		parseSession(handshake, function(config){
			if(config){
				callback(null, true);
			}
			else{
				callback("Not session.", false);
			}
		});
	} else {
		return callback('No session.', false);
	}
});

function parseSession(handshake, callback){
	parseCookie(handshake, null, function(err) {
		handshake.sessionID = handshake.signedCookies[KEY];
		store.get(handshake.sessionID, function (err, session) {
			if (err || !session) {
				callback(false);
			} else {
				callback(session);
			}
		});	
	});
}

io.sockets.on('connection', function (socket) {
	var hs = socket.handshake;
	parseSession(hs, function(session){
		
	});
});