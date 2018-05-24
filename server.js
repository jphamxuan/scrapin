// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

app.use(express.static('public'));

//mongoose connection
mongoose.connect("mongodb://localhost/scrapin");

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send(public/index.html);
});

// Retrieve data from the db
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

// Scrape data from NYT to  mongodb db
app.get("/scrape", function(req, res) {
	
	request("https://www.nytimes.com/", function(error, response, html) {
	  // Load the html body from request into cheerio
	  var $ = cheerio.load(html);
	  
	  $("article.story").each(function(i, element) {
	
		var title = $(this)
				.children("h2.story-heading")
				.children("a")
				.text();
		var link = $(this)
				.children("h2.story-heading")
				.children("a")
				.attr("href");
		var summary = $(this)
			.children("p.summary")
				.text();
  
		//adds data to DB
		  db.scrapedData.insert({
			title: title,
      link: link,
      summary: summary,
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
		
		});
		
	});

  // Send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
