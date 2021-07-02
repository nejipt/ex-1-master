const express = require('express')
const router = express.Router()

const AUTHORS = require('../data/authors.json')
const ARTICLES = require('../data/articles.json')
const COUNTRIES = require('../data/countries.json')

/**
 * @returns a list of all authors complete with their country's name and the articles they have written
 */
router.get('/', (req, res) => {
  const fullAuthors = AUTHORS.map(author => {
    if (author.country_code) {
      author.country = COUNTRIES[author.country_code.toLowerCase()]
    }
    author.articles = ARTICLES.filter(article => article.author_id === author.id)

    return author
  })

  res.send(fullAuthors)
})

module.exports = router
