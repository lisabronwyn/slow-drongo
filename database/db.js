const databaseName = 'slow-drongo'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')();
const db = pgp( connectionString );

const getAllBooks = 'SELECT * FROM books'
const getAuthor = 'SELECT * FROM authors WHERE id=$1'
const getBook = 'SELECT * FROM books WHERE id=$1'
const getAuthorByBookID = `
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
  const getBooksByAuthorID = `
    SELECT
      *
    FROM
      books
    JOIN
      book_authors
    ON
      books.id = book_authors.book_id
    WHERE
      book_authors.author_id=$1
  `

Book = {
  getAll: () => db.any( getAllBooks ),
  getBook: book_id => db.one( getBook, [ book_id ] ),
  getAuthor: book_id => db.any( getAuthorByBookID, [ book_id ] )
}

Author = {
  getAuthor: author_id => db.one( getAuthor, [ author_id]),
  getBook: author_id => db.any( getBooksByAuthorID, [author_id])
}

module.exports = { Book, Author }
