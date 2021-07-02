const express = require('express')
const router = express.Router()

const COUNTRIES = require('../data/countries.json')

/**
 * @returns list of all countries names
 */
router.get('/', (req, res, next) => {
  return res.send(Object.values(COUNTRIES))
})

module.exports = router
