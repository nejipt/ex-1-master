const express = require('express')
const router = express.Router()

const countriesRouter = require('./countries')
const authorsRouter = require('./authors')
const articlesRouter = require('./articles')
const endpointARouter = require('./endpoint-a-router')

router.use('/countries', countriesRouter)
router.use('/authors', authorsRouter)
router.use('/articles', articlesRouter)
router.use('/endpoint_a', endpointARouter)

module.exports = router
