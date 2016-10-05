const databaseName = 'slow-drongo'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')();
const db = pgp( connectionString );

const getAllBooks = 'SELECT * FROM books'
const getAllAuthors = 'SELECT * FROM authors'
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

const Search = {
  forBooks: search => {
    const variables = []
    let sql = `SELECT DISTINCT(books.*) FROM books`

    if (search){
      let search_query = search
        .toLowerCase()
        .replace(/^ */, '%')
        .replace(/ *$/, '%')
        .replace(/ +/g, '%')

      variables.push( search_query )

      sql += `
      LEFT JOIN book_authors ON books.id=book_authors.book_id
      LEFT JOIN authors ON authors.id=book_authors.author_id
      LEFT JOIN book_genres ON books.id=book_genres.book_id
      LEFT JOIN genres ON genres.id=book_genres.genre_id
      WHERE LOWER(books.title)  LIKE $${variables.length}
      OR LOWER(authors.name) LIKE $${variables.length}
      OR LOWER(genres.title) LIKE $${variables.length}
      ORDER BY books.id ASC
      `
    }

    return db.any( sql, variables )
  }
}

const Book = {
  getAll: () => db.any( getAllBooks ),
  getBook: book_id => db.one( getBook, [ book_id ] ),
  getAuthor: book_id => db.any( getAuthorByBookID, [ book_id ] )
}

Author = {
  getAll: () => db.any( getAllAuthors ),
  getAuthor: author_id => db.one( getAuthor, [ author_id]),
  getBook: author_id => db.any( getBooksByAuthorID, [author_id])
}

module.exports = { Book, Author, Search }
