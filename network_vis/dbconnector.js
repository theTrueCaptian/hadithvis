var mysql      = require('mysql');
var connection;

function connect(){
	connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '**********',
	  database : 'hadith'
	});
	 
	connection.connect();
	 
	return connection;
}

function query(queryStr, callback){
	connection.query(queryStr, function(err, rows, fields) {
		if (err) throw err;
	 	
		callback(rows, fields);
	});
}


function end(){
	connection.end();
}

module.exports = {
	connect: connect,
	query: query
};