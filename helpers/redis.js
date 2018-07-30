const redis = require('../clients/redis')
const uuid = require('uuid/v1')

const createContext = data => {
  const id = uuid()

  redis.set(id, data)

  return id
}

module.exports = {
  createContext
}
