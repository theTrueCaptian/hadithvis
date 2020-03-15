var http = require('http');

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var serve = serveStatic("./public/");

var server = http.createServer(function(req, res) {
  var done = finalhandler(req, res);
  serve(req, res, done);
});
var port = 7171;
var isDBConnect = true;
console.log("listen on "+port);
server.listen(port);


if(isDBConnect){
    var db = require('./dbconnector');
    db.connect();
    db.query('select hadithText from ArabicHadithTable limit 1;', function(rows, fields){
        console.log("Query result: ", rows)
    });
}
