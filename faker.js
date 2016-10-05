const databaseName = 'slow-drongo'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')();
const db = pgp( connectionString );

const faker = require( 'faker' )


const fakeAuthors = author => {
  const sql = 'INSERT INTO authors( name, bio, img_url ) VALUES ( $1, $2, $3 )'
  db.none( sql, [ author.name, author.bio, author.img_url ] )
}

const generateAuthors = () => {
  for( let i = 30; i >= 0; i-- ) {
    fakeAuthors({
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      bio: faker.lorem.paragraph(),
      img_url: faker.image.people()
    })
  }
}

const fakeBook = book => {
  const sql = 'INSERT INTO books( title, description, img_url ) VALUES ( $1, $2, $3 )'
  db.none( sql, [ book.title, book.description, book.img_url ] )
}

const generateBooks = () => {
  for( let i = 30; i >= 0; i-- ) {
    fakeBook({
      title: faker.internet.domainName(),
      description: faker.lorem.paragraph(),
      img_url: faker.image.people()
    })
  }
}

const fakeBook = genre => {
  const sql = 'INSERT INTO genres( title ) VALUES ( $1 )'
  db.none( sql, [ genre.title ] )
}

const generateBooks = () => {
  for( let i = 30; i >= 0; i-- ) {
    fakeBook({
      title: faker.internet.domainName(),
      description: faker.lorem.paragraph(),
      img_url: faker.image.people()
    })
  }
}

const findBooks = () => {
  const sql = 'SELECT * FROM books'
  return db.any( sql )
}

const findAuthors = () => {
  const sql = 'SELECT * FROM authors'
  return db.any( sql )
}

const bookAuthors = ( ids ) => {
  const sql = 'INSERT INTO book_authors( book_id, author_id ) VALUES ( $1, $2 )'

  db.any( sql, [ ids.book_id, ids.author_id ])
}

const generateBookAuthors = () => {
  findBooks().then( books => {
    Promise.resolve( findAuthors() )
      .then( authors => {
        const queries = []
        console.log( authors, books );

        for( let i = 30; i >= 0; i-- ) {
          queries.push(
            bookAuthors({
              book_id: faker.random.arrayElement( books ).id,
              author_id: faker.random.arrayElement( authors ).id
            })
          )
        }

        Promise.all( queries )
      })
  })
}

module.exports = { generateAuthors,  generateBooks, generateBookAuthors }
