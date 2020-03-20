var express = require('express');
var router = express.Router();

const Book = require('../models/class');
const Author = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Classy' });
});


router.get('/home', (req, res, next) => {
  res.render('landing-page')
});



////////////////////////////
router.get('/book/add', (req, res, next) => {
  res.render("book-add");
});

router.post('/book/add', (req, res, next) => {
  const { title, author, description, rating } = req.body;
  const newBook = new Book({ title, author, description, rating})
  newBook.save()
  .then((book) => {
    res.redirect('/books');
  })
  .catch((error) => {
    console.log(error);
  })
});

router.get('/book/edit', (req, res, next) => {
  Book.findOne({_id: req.query.book_id})
  .then((book) => {
    res.render("book-edit", {book});
  })
  .catch((error) => {
    console.log(error);
  })
});

router.post('/book/edit', (req, res, next) => {
  const { title, author, description, rating } = req.body;
  Book.update({_id: req.query.book_id}, { $set: {title, author, 
description, rating }}, { new: true })
  .then((book) => {
    res.redirect('/books');
  })
  .catch((error) => {
    console.log(error);
  })
});

router.get('/books', (req, res, next) => {
  Book.find()
    .then(allTheBooksFromDB => {
      // console.log('Retrieved books from DB:', allTheBooksFromDB);
      res.render('books', { books: allTheBooksFromDB });
    })
    .catch(error => {
      console.log('Error while getting the books from the DB: ', error);
    })
});

router.get('/authors/add', (req, res, next) => {
  res.render("author-add")
});

router.post('/authors/add', (req, res, next) => {
  const { name, lastName, nationality, birthday, pictureUrl } = req.body;
  const newAuthor = new Author({ name, lastName, nationality, birthday, pictureUrl})
  newAuthor.save()
  .then((book) => {
    res.redirect('/books')
  })
  .catch((error) => {
    console.log(error)
  })
});

router.get('/book/:bookId', (req, res, next) => {
  let bookId = req.params.bookId;
  if (!/^[0-9a-fA-F]{24}$/.test(bookId)) { 
    return res.status(404).render('not-found');
  }
  Book.findOne({'_id': bookId})
    .populate('author')//mi popula MongoDB e mi mette tutto documento di autor dentro ad autor attraverso l'ID
    .then(book => {
      if (!book) {
          return res.status(404).render('not-found');
      }
      res.render("book-details", { book })
    })
    .catch(next)
});

router.post('/reviews/add', (req, res, next) => {
  const { user, comments } = req.body;
  Book.update(
    { _id: req.query.book_id },
    { $push: { reviews: { user, comments } } }
  )
    .then(book => {
      res.redirect('/book/' + req.query.book_id);
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;