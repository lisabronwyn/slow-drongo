const express = require('express')
const router = express.Router()
const { Book } = require('../database/db')

/* GET home page. */
router.get('/', ( request, response ) => {
  Book.getAll().then( books => response.render( 'index', { books } ) )
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
