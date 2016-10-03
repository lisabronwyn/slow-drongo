const express = require('express')
const router = express.Router()
const { Book } = require('../database/db')

/* GET home page. */
router.get('/', ( request, response ) => {

  Book.getAll().then( books => response.render( 'index', { books } ) )
})

module.exports = router
