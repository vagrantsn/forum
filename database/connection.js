const mongoose = require('mongoose');
const bluebird = require('bluebird');
const config = require('../config');
mongoose.Promise = bluebird

mongoose.connection.once('error', (e) => {
  console.error(e)
})

mongoose.connection.once('open', () => {
  console.log('mongoose connected')
})

mongoose.connection.once('close', () => {
  console.log('mongoose disconnected')
})

const url = `mongodb://${config.get('mongo').host}:${config.get('mongo').port}/${config.get('mongo').db}`
const connection = mongoose.connect(url)
module.exports = connection
