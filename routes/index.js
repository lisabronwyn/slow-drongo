const express = require('express')
const router = express.Router()
const { Book, Author, Search } = require('../database/db')

/* GET home page. */
router.get('/', ( request, response ) => {
  Book.getAll().then( books => response.render( 'index', { books } ) )
})

router.get('/search-books', ( request, response ) => {
  const { search_query } = request.query

  Search.forBooks( search_query ).then( books => {
    response.send( books )
  })
})

router.get('/authors/list', (request, response) => {
  Author.getAll().then( authors => response.render('authorList', {authors} ))
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

module.exports = router
