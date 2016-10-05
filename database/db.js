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
  getAuthor: book_id => db.one( getAuthor, [ book_id ] )
}

module.exports = { Book, Search }
