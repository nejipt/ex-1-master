const express = require('express')
const router = express.Router()

const ARTICLES = require('../data/articles.json')
const AUTHORS = require('../data/authors.json')

/**
 * Gets articles all articles
 * @returns Array of articles
 */
router.get('/', (req, res, next) => {
  if (!ARTICLES || !ARTICLES.length) {
    return next(new Error('ServiceUnavailableError'))
  }

  return res.send(ARTICLES)
})

/**
 * Gets article by articleId
 * @param articleId
 * @returns Array of articles
 */
router.get('/:articleId', (req, res, next) => {
  if (!req.params.articleId || Number.isNaN(req.params.articleId)) {
    return next(new Error('InvalidParametersError'))
  }

  const _articleId = Number.parseInt(req.params.articleId)

  const article = ARTICLES.find(_article => _article.id === _articleId)

  if (!article) {
    return next(new Error('NotFoundError'))
  }

  return res.send(article)
})

/**
 * Gets articles by author id
 * @param authorId
 * @returns articles - Array
 */
router.get('/:authorId/author', (req, res, next) => {
  if (!req.params.authorId || Number.isNaN(req.params.authorId)) {
    return next(new Error('InvalidParametersError'))
  }

  const _authorId = req.params._authorId

  const foundArticles = ARTICLES.filter(article => article.author_id === _authorId)

  return res.send(foundArticles)
})

/**
 * Creates new article with an authorId and a title, if author does not exist create empty author
 * @params authorId
 * @params title
 * @redirects to article list
 */
router.post('/', (req, res, next) => {
  if (!req.body.authorId || Number.isNaN(req.body.authorId)) {
    return next(new Error('InvalidParametersError'))
  }

  if (!req.body.title) {
    return next(new Error('InvalidParametersError'))
  }

  const _authorId = Number.parseInt(req.body.authorId)

  const author = AUTHORS.find(author => author.id === _authorId)

  if (!author) {
    AUTHORS.push({ id: _authorId })
  }

  ARTICLES.push({
    id: ARTICLES.length + 1,
    author_id: _authorId,
    title: req.body.title
  })

  return res.redirect(`/articles/${ARTICLES.length}`)
})

/**
 * Receives an array of articleIds and updates those ids with one title and author
 * @param articleIds - Array
 * @param title String
 * @param authorId Number
 * @redirects to article list
 */
// this could also receive an array of articles and the logic would be pretty much the same we would go through the
// article array passed as a parameter and update each article id
router.put('/', (req, res, next) => {
  // I believe this should always be an array (even if it's an array of one element),
  // but for the case of the exercise I will accept number and cast it to Array
  if (!req.body.articleIds || (!Array.isArray(req.body.articleIds) && Number.isNaN(req.body.articleIds))) {
    return next(new Error('InvalidParametersError'))
  }

  let _articlesIds = req.body.articleIds

  if (!Array.isArray(_articlesIds)) {
    _articlesIds = [_articlesIds]
  }

  const { title, authorId } = req.body

  const _authorId = Number.parseInt(req.body.authorId)

  const author = AUTHORS.find(author => author.id === _authorId)

  if (!author) {
    AUTHORS.push({ id: _authorId })
  }

  _articlesIds.forEach(articleId => {
    const _articleId = Number.parseInt(articleId)

    if (Number.isNaN(_articleId)) {
      return
    }

    const articleIndex = ARTICLES.findIndex(_article => _article.id === articleId)

    // Unsure if I should create a new article here with a new id (would be articles.length +1) and using this author
    // and title, it would be possible but since the requirements say only update and not create a new one if it doesn't
    // exist I'm not gonna do it here
    if (articleIndex === -1) {
      return
    }

    ARTICLES[articleIndex].title = title
    ARTICLES[articleIndex].author_id = authorId
  })

  return res.redirect('/articles')
})

/**
 * Receives an array of articleIds and deletes the articles with corresponding ids
 * @param articleIds - Array
 * @redirects to article list
 */
router.delete('/', (req, res, next) => {
  // I believe this should always be an array (even if it's an array of one element),
  // but for the case of the exercise I will accept number and cast it to Array
  if (!req.body.articleIds || (!Array.isArray(req.body.articleIds) && Number.isNaN(req.body.articleIds))) {
    return next(new Error('InvalidParametersError'))
  }

  let _articlesIds = req.body.articleIds

  if (!Array.isArray(_articlesIds)) {
    _articlesIds = [_articlesIds]
  }

  _articlesIds.forEach(articleId => {
    const _articleId = Number.parseInt(articleId)

    if (Number.isNaN(_articleId)) {
      return
    }

    const articleIndex = ARTICLES.findIndex(_article => _article.id === articleId)

    if (articleIndex === -1) {
      return
    }

    ARTICLES.splice(articleIndex, 1)
  })

  return res.redirect('/articles')
})

module.exports = router
