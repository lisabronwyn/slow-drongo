const databaseName = 'slow-drongo'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')();
const db = pgp( connectionString );

const getAllBooks = 'SELECT * FROM books'
const getBook = 'SELECT * FROM books WHERE id=$1'
const getAuthor = `
  SELECT
    *
  FROM
    authors
  JOIN
    book_authors
  ON
    authors.id = book_authors.author_id
  WHERE
    book_authors.book_id=$1
  `;

Book = {
  getAll: () => db.any( getAllBooks ),
  getBook: book_id => db.one( getBook, [ book_id ] ),
  getAuthor: book_id => db.one( getAuthor, [ book_id ] )
}

module.exports = { Book }
