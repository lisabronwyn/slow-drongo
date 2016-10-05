const express = require('express')
const router = express.Router()
const { Book } = require('../database/db')

/* GET home page. */
router.get('/', ( request, response ) => {
  Book.getAll().then( books => response.render( 'index', { books } ) )
})

router.get('/book/:book_id', ( request, response ) => {
  const { book_id } = request.params

  console.log( 'Id', book_id )

  Promise.all([ Book.getBook( book_id ), Book.getAuthor( book_id ) ])
    .then( data => {
      const [ book, authors ] = data

      //response.send(data)
      response.render( "bookDetails", {book, authors} )
    })
})

module.exports = router
