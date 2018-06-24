const Redis = require('ioredis')
const config = require('../config')

const redis = new Redis(`${config.get('redis').host}:${config.get('redis').port}`)

module.exports = redis
