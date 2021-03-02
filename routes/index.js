var express = require('express');
var router = express.Router();

var dbConn = require('../lib/db');

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.loggedin) {
    res.redirect('/books');
  }else{
    res.render('index', { title: 'Book Store' });
  }
  
});


router.post('/auth', function (request, response) {
  var username = request.body.username;
  var password = request.body.password;

  if (username && password) {
    dbConn.query('SELECT * FROM users WHERE email = ? AND password = ?', [username, password], function (error, results, fields) {
      if (results.length > 0) {
        request.session.loggedin = true;
        request.session.username = username;
        request.session.userid = results[0].id;
        response.redirect('/books');
      } else {
        response.send('Incorrect Username and/or Password!');
        response.end();
      }


    });
  } else {
    response.send('Please enter Username and Password!');
    response.end();
  }
});
module.exports = router;
