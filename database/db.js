const databaseName = 'slow-drongo'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')();
const db = pgp( connectionString );

const getAllBooks = 'SELECT * FROM books'
const getAllAuthors = 'SELECT * FROM authors'
const getAllGenres = 'SELECT * FROM genres'
const getAuthor = 'SELECT * FROM authors WHERE id=$1'
const getGenre = 'SELECT * FROM genres WHERE id=$1'
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

const getBooksByGenreID = `
    SELECT
      *
    FROM
      books
    JOIN
      book_genres
    ON
      books.id = book_genres.book_id
    WHERE
      book_genres.genre_id=$1
  `


const getGenresByBookID = `
    SELECT
      *
    FROM
      genres
    JOIN
      book_genres
    ON
      genres.id = book_genres.genre_id
    WHERE
      book_genres.book_id=$1
  `


Book = {
  getAll: () => db.any( getAllBooks ),
  getBook: book_id => db.one( getBook, [ book_id ] ),
  getAuthor: book_id => db.any( getAuthorByBookID, [ book_id ] )
}

Author = {
  getAll: () => db.any( getAllAuthors ),
  getAuthor: author_id => db.one( getAuthor, [ author_id]),
  getBook: author_id => db.any( getBooksByAuthorID, [author_id])
}

Genre = {
  getAll: () => db.any( getAllGenres ),
  getGenre: genre_id => db.one( getGenre, [ genre_id ] ),
  getBook: genre_id => db.any( getBooksByGenreID, [ genre_id ] )
}


module.exports = { Book, Author, Genre }
