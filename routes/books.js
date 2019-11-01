var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* GET books listing. */
router.get('/', function (req, res, next) {
  Book.findAll({ order: [['title', 'ASC']] })
    .then(function (books) {
      res.render('books/index', {
        books: books,
        title: 'My Library'
      });
    })
    .catch(function (err) {
      next(err)
    });
});

/* Create a new book form. */
router.get('/new', function (req, res, next) {
  res.render('books/new-book', {
    book: Book.build(),
    title: 'New Book'
  });
});

/* POST new book */
router.post('/new', function (req, res, next) {
  Book.create(req.body)
    .then(function (book) {
      res.redirect('/books/');
    })
    .catch(function (err) {
      if (err.name === 'SequelizeValidationError') {
        res.render('books/new-book', {
          book: Book.build(req.body),
          title: 'New Book',
          errors: err.errors
        });
      } else {
        next(err)
      }
    })
    .catch(function (err) {
      res.send(500);
    });

});

/* Update book form*/
router.post('/:id', function (req, res, next) {
  Book.findByPk(req.params.id)
    .then(function (book) {
      if (book) {
        return book.update(req.body);
      } else {
        req.status(404);
      }
    })
    .then(function (book) {
      res.redirect('/');
    })
    .catch(function (err) {
      if (err.name === 'SequelizeValidationError') {
        const book = Book.build(req.body);
        book.id = req.params.id;
        res.render('books/update-book', {
          book: book,
          title: 'Update Book',
          errors: err.errors
        });
      } else {
        throw err;
      }
    })
    .catch(function (err) {
      res.status(500);
    });
});

/* GET individual book. */
router.get('/:id', function (req, res, next) {
  Book.findByPk(req.params.id)
    .then(function (book) {
      if (book) {
        res.render('books/update-book', { book, title: 'Update Book' });
      } else {
        res.status(404);
      }
    })
    .catch(function (err) {
      res.status(500);
    });

});

/* Delete book form. */
router.post('/:id/delete', function (req, res, next) {
  Book.findByPk(req.params.id)
    .then(function (book) {
      if (book) {
        return book.destroy();
      } else {
        res.status(404);
      }
    })
    .then(function () {
      res.redirect('/books');
    })
    .catch(function (err) {
      res.status(500);
    });
});

/* DELETE individual article. */
router.delete('/:id/delete', function (req, res, next) {
  Book.findByPk(req.params.id)
    .then(function (book) {
      if (book) {
        return book.destroy();
      } else {
        res.status(404);
      }
    })
    .then(function () {
      res.redirect('/books');
    })
    .catch(function (err) {
      res.status(500);
    });
});

module.exports = router;
