let logger

function errorHandler (err, req, res, next) {
  switch (err.name) {
    case 'InvalidParametersError':
    case 'NotFoundError':
    case 'ServiceUnavailableError':
      logger.err(`${err.errorCode} - ${err.name}`)
      break
    default:
      logger.err('400 - Bad Request')
      break
  }
  return res.send(err)
}

module.exports = (_logger) => {
  logger = _logger
  return errorHandler
}
