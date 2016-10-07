const express = require('express')
const router = express.Router()

const { Book, Author, Search, Genre } = require('../database/db')

/* GET home page. */
router.get('/', ( request, response ) => {
  const {query} = request
  const page = parseInt( query.page || 1)
  const size = parseInt( query.size || 10)
  const nextPage = page + 1
  const previousPage = page - 1 > 0 ? page -1: 1
  Book.getLimit(size, page).then( books => response.render( 'index', { books, page, size, nextPage, previousPage } ) )
})

router.get('/search-books', ( request, response ) => {
  const { search_query } = request.query

  Search.forBooks( search_query ).then( books => {
    response.render( 'index', {books} )
  })
})

router.get('/authors/list', (request, response) => {
  Author.getAll().then( authors => response.render('authorList', {authors} ))
})

router.get('/genre/list', (request, response) => {
  Genre.getAll().then( genres => response.render('genreList', {genres} ))
})

router.get('/book/:book_id', ( request, response ) => {
  const { book_id } = request.params

  Promise.all([ Book.getBook( book_id ), Book.getAuthor( book_id ) ])
    .then( data => {
      const [ book, authors ] = data

      //response.send(data)
      response.render( "bookDetails", {book, authors} )
    })
})

router.get('/author/:author_id', (request, response) => {
  const { author_id } = request.params

  Promise.all([Author.getAuthor( author_id ), Author.getBook( author_id) ])
    .then( data => {
        const [ author, books] = data

      //response.send(data)
      response.render( "authorDetails", {author, books})
    })
})

router.get('/genre/:genre_id', (request, response) => {

  const { genre_id } = request.params

  Promise.all([Genre.getGenre( genre_id ), Genre.getBook( genre_id) ])
    .then( data => {
      const [genre, books] = data

     // response.send(data)

    response.render( "genreDetails", {genre, books})

    })
})

router.get('/book/new/create', (request, response) => {
  Promise.all([Author.getAll(), Genre.getAll()])
    .then(data => {
      const [authors, genres] = data
        response.render('create-book', {authors, genres})

    })
})

router.post('/book/new/create', (request, response) => {
  const book = request.body
  const author_id = parseInt(book.author_id)
  const genre_id = parseInt(book.genre_id)

  Book.insert(book)
    .then(book => {
      const book_id = book.id
      Promise.all([Book.joinAuthor(book_id, author_id), Book.joinGenre(book_id, genre_id)])
      response.redirect(`/book/${book_id}`)
    })
})

module.exports = router
