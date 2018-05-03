const express = require('express')
const bodyParser = require('body-parser')

const routes = require('./routes')

let app = express()

app.use(bodyParser.json())
app.use('/', routes)

app.listen(3000, () => console.log('Listening on port 3000...'))

module.exports = app