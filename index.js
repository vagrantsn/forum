const express = require('express')
const bodyParser = require('body-parser')
require('./database/connection');
require('dotenv').config()

const routes = require('./routes')

let app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
 extended: true
}))
app.use('/', routes)

app.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000...'))

module.exports = app
