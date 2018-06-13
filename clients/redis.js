const Redis = require('ioredis')

const redis = new Redis(`${process.env.REDIS_HOST}:6379`)

module.exports = redis
