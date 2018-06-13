const mongoose = require('mongoose');
const bluebird = require('bluebird');
mongoose.Promise = bluebird

mongoose.connection.once('error', () => {
  console.log('mongoose: Error connecting to mongo')
})

mongoose.connection.once('open', () => {
  console.log('mongoose connected')
})

mongoose.connection.once('close', () => {
  console.log('mongoose disconnected')
})

mongoose.connect(process.env.DB_URL)
