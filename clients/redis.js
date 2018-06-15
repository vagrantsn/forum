const Redis = require('ioredis')
const config = require('../config')

const redis = new Redis({
  port: config.get('redis').port,
  host: config.get('redis').host,
  db: config.get('redis').database
})

module.exports = redis
