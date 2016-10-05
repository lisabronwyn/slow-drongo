const express = require('express')
const router = express.Router()
const { Book, Search } = require('../database/db')

/* GET home page. */
router.get('/', ( request, response ) => {
  Book.getAll().then( books => response.render( 'index', { books } ) )
})

router.get('/search-books', ( request, response ) => {
  const { search_query } = request.query

  Search.forBooks( search_query ).then( books => {
    console.log( 'Second Stop', books );

    response.send( books )
  })
  .catch( error => error )
})

router.get('/book/:book_id', ( request, response ) => {
  const { book_id } = request.params

  Promise.all([ Book.getBook( book_id ), Book.getAuthor( book_id ) ])
    .then( data => {
      const [ book, author ] = data

      response.send( data )
    })
})

module.exports = router
