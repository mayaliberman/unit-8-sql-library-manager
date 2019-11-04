var express = require('express');
var router = express.Router();
const Book = require('../models').Book;


function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  }
}

/* GET books listing. */
router.get('/', asyncHandler(async (req, res, next) => {
  const books = await Book.findAll({ order: [['title', 'ASC']] });
  if (books) {
    res.render('books/index', {
      books: books,
      title: 'My Library'
    });
  } else {
    res.status(500)
  }

}));

/* Create a new book form. */
router.get('/new', function (req, res, next) {
  res.render('books/new-book', {
    book: Book.build(),
    title: 'New Book'
  });
});

/* POST new book */
router.post('/new', (req, res, next) => {
  Book.create(req.body)
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      if (err.name === 'SequelizeValidationError') {
        res.render('books/new-book', {
          book: Book.build(req.body),
          title: 'New Book',
          errors: err.errors
        });
      } else {
        throw err;
      }
    })

    .catch((err) => {
      res.status(500);
    });
});


/* Update book form*/
router.post('/:id',  (req, res, next) => {
  Book.findByPk(req.params.id)
    .then( (book) => {
      if (book) {
        return book.update(req.body);
      } else {
        req.status(404);
      }
    })
    .then( () => {
      res.redirect('/');
    })
    .catch( (err) => {
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
    .catch( (err) => {
      res.status(500);
    });
});


/* GET individual book. */
router.get('/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('books/update-book', { book, title: 'Update Book' });
  } else {
    res.status(404).render('error', {
      message: 'Page not found',
      error: {
        status: 404,
        stack: 'The book you were looking for does not exist :('
      }
    })
  }
}
));

/* Delete book form. */
router.post('/:id/delete', function (req, res, next) {
  Book.findByPk(req.params.id)
    .then((book) => {
      if (book) {
        return book.destroy();
      } else {
        res.status(404);
      }
    })
    .then(() => {
      res.redirect('/books');
    })
    .catch((err) => {
      res.status(500);
    });
});

/* DELETE individual article. */
router.delete('/:id/delete', (req, res, next) => {
  Book.findByPk(req.params.id)
    .then((book) => {
      if (book) {
        return book.destroy();
      } else {
        res.status(404);
      }
    })
    .then(() => {
      res.redirect('/books');
    })
    .catch((err) => {
      res.status(500);
    });
});

module.exports = router;
