var proxy=require('./proxy');
var fs=require('fs');
var bodyParser = require('body-parser');
var db= require('./db')
var querystring=require('querystring');

var express = require('express'),
    app = express();
app.use(express.static(__dirname + '/test'));  
app.listen(4030);

var express2 = require('express'),  
    app2 = express();
app2.use(express2.static(__dirname + '/rhythmer'));
app2.listen(3000);

app2.use(bodyParser.urlencoded({ extended: true }));
app2.use(bodyParser.json());
app2.set('views', __dirname);
app2.set('view engine', 'jade');

app2.post('/find',function(req,res){
	db.find(function(doc){
		res.json(doc)
	});
});
app2.post('/findOne',function(req,res){
	db.findOne(req.body,function(doc){
		res.json(doc)
	});
});
app2.post('/save',function(req,res){
	db.save(req.body,function(doc){
		res.json(doc)
	});
});
app2.post('/update',function(req,res){
	db.update(req.body,function(doc){
		res.json(doc)
	});
});