/*
Maeda Hanafi

Runs a basic node server that serves pages from /public and connects to the mysql database containing hadith.

Mysql database: If it doesn't connect with server.js run "mysql.server restart" in terminal.
*/

var express = require('express');
var app = express();

//Parser for post data
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Setup databases
var db = require('./dbconnector');
db.connect();

var tokensFile = "./public/tokens/tokens.json";

//Set up routes
app.use(express.static('public'));

app.get('/hadithTexts', function (req, res) {
	db.query('select hadithText from ArabicHadithTable limit 100;', function(rows, fields){
	    console.log("Query result: ", rows)
    	res.end(JSON.stringify(rows));
	});
})

app.get('/tokens', function (req, res) {
	var fs = require('fs');
	fs.readFile(tokensFile, function read(err, tokens) {
		if (err) { throw err; }
		res.end(tokens);
	});

})

app.post('/saveTokens', function(req, res) {
    var tokens = req.body;
	//Save the tokens to a file
	var fs = require('fs');
	fs.writeFile(tokensFile, JSON.stringify(tokens), function(err) {
		if(err) { 	res.send(err); return console.log(err); }
		console.log("The file was saved!");
		res.send("The file was saved:"+JSON.stringify(tokens));
	}); 
});


var server = app.listen(7171, function () {

	var host = server.address().address
	var port = server.address().port

	console.log("Example app listening at http://%s:%s", host, port)

})
