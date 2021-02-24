var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'linereflection.com',
	user:'linereflection_books',
	password:'ZsE3,&yEC3Z9',
	database:'linereflection_books'
});
connection.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
		console.log('Connected..!');
	}
});

module.exports = connection;
