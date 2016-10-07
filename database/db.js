const databaseName = 'slow-drongo'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')();
const db = pgp( connectionString );

const getAllBooks = 'SELECT * FROM books'
const getLimitBooks = "SELECT * FROM books LIMIT $1 OFFSET $2"
const getAllAuthors = 'SELECT * FROM authors'
const getAllGenres = 'SELECT * FROM genres'
const getAuthor = 'SELECT * FROM authors WHERE id=$1'
const getGenre = 'SELECT * FROM genres WHERE id=$1'
const getBook = 'SELECT * FROM books WHERE id=$1'
const insertBook = 'insert into books ( title, description, img_url ) values ($1,$2, $3) returning id'
const joinAuthor = `insert into book_authors ( book_id, author_id ) values ($1,$2,)`
const joinGenre = `insert into book_genres (book_id, genre_id) values ($1,$2)`
const deleteBook = 'DELETE FROM books WHERE id = $1'

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
      OR LOWER(genres.genre) LIKE $${variables.length}
      ORDER BY books.id ASC
      `
    }

    return db.any( sql, variables )
  }
}

const Book = {
  getAll: () => db.any( getAllBooks ),
  getLimit: (size, page) => db.any (getLimitBooks, [size, ( page * size ) - size]),
  getBook: book_id => db.one( getBook, [ book_id ] ),
  getAuthor: book_id => db.any( getAuthorByBookID, [ book_id ] ),
  insert: book => db.one( insertBook, [book.title, book.description, "http://lorempixel.com/640/480/nature"]),
  joinAuthor: (book_id, author_id) => db.none(joinAuthor, [book_id, author_id]),
  joinGenre: (book_id, genre_id) => db.none(joinGenre, [book_id, genre_id]),
  delete: book_id => db.none(  deleteBook, [ book_id ] )
}

const Author = {
  getAll: () => db.any( getAllAuthors ),
  getAuthor: author_id => db.one( getAuthor, [ author_id]),
  getBook: author_id => db.any( getBooksByAuthorID, [author_id])
}

const Genre = {
  getAll: () => db.any( getAllGenres ),
  getGenre: genre_id => db.one( getGenre, [ genre_id ] ),
  getBook: genre_id => db.any( getBooksByGenreID, [ genre_id ] )
}



module.exports = { Book, Author, Search, Genre }
