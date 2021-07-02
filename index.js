const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes')
const errorHandler = require('./error-handler')

const app = express()
const port = 3000

const baseMiddlewares = [
  bodyParser.json({
    limit: '20mb'
  })
]

app.use(baseMiddlewares)

app.use(routes)

app.use(errorHandler({ err: err => console.log(err) }))

app.listen(port, () => console.log(`App listening on http://127.0.0.1:${port}`))
