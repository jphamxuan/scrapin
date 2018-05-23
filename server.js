//dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');
var mongojs = require("mongojs");

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

//get data from DB
app.get("/all", function(req, res) {
	// Find all results from the scrapedData collection in the db
	db.scrapedData.find({}, function(error, found) {
	  // Throw any errors to the console
	  if (error) {
		console.log(error);
	  }
	  // If there are no errors, send the data to the browser as json
	  else {
		res.json(found);
	  }
	});
  });
  
  //scrape from website
  app.get("/scrape", function(req, res) {
	// Make a request for the news section of `ycombinator`
	request("https://www.nytimes.com/", function(error, response, html) {
	  // Load the html body from request into cheerio
	  var $ = cheerio.load(html);
	  // For each element with a "story-heading" class
	  $("h2.story-heading").each(function(i, element) {
		// Save the text and href of each link enclosed in the current element
		var title = $(element).children("a").text();
		var link = $(element).children("a").attr("href");
		// var link = $(element).children("a").attr("href");
  
		// If this found element had both a title and a link
		if (title) {
		  // Insert the data in the scrapedData db
		  db.scrapedData.insert({
			title: title,
			// link: link
		  },
		  function(err, inserted) {
			if (err) {
			  // Log the error if one is encountered during the query
			  console.log(err);
			}
			else {
			  // Otherwise, log the inserted data
			  console.log(inserted);
			}
		  });
		}
	  });
	});

	  // Send a "Scrape Complete" message to the browser
	  res.send("Scrape Complete");
	});
	
	
	// Listen on port 3000
	app.listen(3000, function() {
	  console.log("App running on port 3000!");
	});
	
  

