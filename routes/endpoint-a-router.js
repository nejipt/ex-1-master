const express = require('express')
const router = express.Router()

const AUTHORS = require('../data/authors.json')

const VALID_SORTS = ['id', 'name', 'country']
const VALID_ORDERS = ['asc', 'desc']

const SORTING_FUNCTIONS = {
  id: (a, b) => a.id - b.id,
  name: (a, b) => a.name.localeCompare(b.name),
  country: (a, b) => a.country.localeCompare(b.country)
}

/**
 * @param per_page
 * @param page
 * @param order
 * @param sort
 * @returns list which represents a given {page} of size {per_page} sorted by {sort} and ordered by {order}
 */
router.get('/', (req, res, next) => {
  // could set some defaults here like { per_page:5, page: 1, order: 'name', sort: 'asc'} but since it was not specified
  // I will just ensure that all parameters are there
  const { per_page, page, order, sort } = req.query

  const _perPage = Number.parseInt(per_page)
  const _page = Number.parseInt(page)

  if (!per_page || Number.isNaN(_perPage) || !page || Number.isNaN(_page) || !order || !sort) {
    return next(new Error('InvalidParametersError'))
  }

  const maximumPages = AUTHORS.length / _perPage

  if (_page > Math.ceil(maximumPages)) {
    return next(new Error('InvalidParametersError'))
  }

  const startingIndex = (_page * _perPage) - _perPage
  const endingIndex = (_page * _perPage) - 1

  if (!VALID_SORTS.includes(sort) || !Object.keys(SORTING_FUNCTIONS).includes(sort) || !VALID_ORDERS.includes(order)) {
    return next(new Error('InvalidParametersError'))
  }

  const sortingFunction = SORTING_FUNCTIONS[sort]

  const sortedAuthorsPage = AUTHORS.sort((authorA, authorB) => {
    return order === 'asc' ? sortingFunction(authorA, authorB) : sortingFunction(authorB, authorA)
  }).slice(startingIndex, endingIndex)

  return res.send(sortedAuthorsPage)
})

module.exports = router
