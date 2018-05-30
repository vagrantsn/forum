const uuid = require('uuid/v1')

const createContext = (redis, data) => {
  const id = uuid()
  
  redis.set(id, data)

  return id
}

module.exports = {
  createContext
}
