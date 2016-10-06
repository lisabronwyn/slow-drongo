const express = require('express')
const router = express.Router()
const { Book, Author, Genre } = require('../database/db')

/* GET home page. */
router.get('/', ( request, response ) => {
  Book.getAll().then( books => response.render( 'index', { books } ) )
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


module.exports = router
