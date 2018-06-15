const express = require('express')
const bodyParser = require('body-parser')

require('dotenv').config()
require('./database/connection')
const app = express()

require('./subscriptions_loader')
const routes = require('./routes')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', routes)

app.listen(3000, () => console.log('listening on port 3000...'))
