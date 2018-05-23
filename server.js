//dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');

//use body parser
app.use(bodyParser.urlencoded({
	extended: false
}));

//use public folder
app.use(express.static('public'));

//mongoose connection
mongoose.connect('');
// mongoose.connect('mongodb://localhost/onionScraper');
var db = mongoose.connection;

//mongo error handling
db.on('error', function(err) {
	console.log('Mongoose Error: ', err);
});

//schemas models
var Note = require('./models/Note.js');
var Article = require('./models/Article.js');

//routes
app.get('/', function(req, res) {
	res.send(index.html);
});

