var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

// display books page
router.get('/', function (req, res, next) {

    

    if (req.session.loggedin) {
        dbConn.query('SELECT * FROM books ORDER BY id desc', function (err, rows) {

            if (err) {
                req.flash('error', err);
                // render to views/books/index.ejs
                res.render('books', { data: '' });
            } else {
                // render to views/books/index.ejs
                res.render('books', { data: rows });
            }
        });
    } else {
        res.redirect('/');
    }



});

// display add book page
router.get('/add', function (req, res, next) {
    // render to add.ejs
    res.render('books/add', {
        name: '',
        author: ''
    })
})

// add a new book
router.post('/add', function (req, res, next) {

    let name = req.body.name;
    let author = req.body.author;
    let errors = false;

    if (name.length === 0 || author.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and author");
        // render to add.ejs with flash message
        res.render('books/add', {
            name: name,
            author: author
        })
    }

    // if no error
    if (!errors) {

        var form_data = {
            name: name,
            author: author
        }

        // insert query
        dbConn.query('INSERT INTO books SET ?', form_data, function (err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to add.ejs
                res.render('books/add', {
                    name: form_data.name,
                    author: form_data.author
                })
            } else {
                req.flash('success', 'Book successfully added');
                res.redirect('/books');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:id)', function (req, res, next) {

    let id = req.params.id;

    dbConn.query('SELECT * FROM books WHERE id = ' + id, function (err, rows, fields) {
        if (err) throw err

        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Book not found with id = ' + id)
            res.redirect('/books')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('books/edit', {
                title: 'Edit Book',
                id: rows[0].id,
                name: rows[0].name,
                author: rows[0].author
            })
        }
    })
})

// update book data
router.post('/update/:id', function (req, res, next) {

    let id = req.params.id;
    let name = req.body.name;
    let author = req.body.author;
    let errors = false;

    if (name.length === 0 || author.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and author");
        // render to add.ejs with flash message
        res.render('books/edit', {
            id: req.params.id,
            name: name,
            author: author
        })
    }

    // if no error
    if (!errors) {

        var form_data = {
            name: name,
            author: author
        }
        // update query
        dbConn.query('UPDATE books SET ? WHERE id = ' + id, form_data, function (err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('books/edit', {
                    id: req.params.id,
                    name: form_data.name,
                    author: form_data.author
                })
            } else {
                req.flash('success', 'Book successfully updated');
                res.redirect('/books');
            }
        })
    }
})

// delete book
router.get('/delete/(:id)', function (req, res, next) {

    let id = req.params.id;

    dbConn.query('DELETE FROM books WHERE id = ' + id, function (err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/books')
        } else {
            // set flash message
            req.flash('success', 'Book successfully deleted! ID = ' + id)
            // redirect to books page
            res.redirect('/books')
        }
    })
})

// Add to cart
router.get('/addtocart/(:id)/(:bookName)', function (req, res, next) {

    if (!req.session.loggedin) {
        res.redirect('/');
    } else {
        let id = req.params.id;
        let userId = req.session.userid;
        let bookName = req.params.bookName
        console.log(id);
        console.log(userId);

        var form_data = {
            bookId: id,
            userId: userId,
            bookName: bookName
        }

        // insert query
        dbConn.query('INSERT INTO carts SET ?', form_data, function (err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

            } else {
                req.flash('success', 'Added to cart');
                res.redirect('/books');
            }
        });
    }

})


router.get('/cart', function (req, res, next) {

    if (!req.session.loggedin) {
        res.redirect('/');
    } else {
        let userid = req.session.userid;
        dbConn.query('SELECT * FROM carts LEFT JOIN books ON carts.bookId = books.id WHERE userId = ? ORDER BY carts.id desc',[userid], function (err, rows) {

            if (err) {
                req.flash('error', err);
                // render to views/books/index.ejs
                res.render('books/cart', { data: '' });
            } else {
    
    
                // render to views/books/index.ejs
                res.render('books/cart', { data: rows });
    
            }
        });
    }
    


});


module.exports = router;