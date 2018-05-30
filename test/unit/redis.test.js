const { expect } = require('chai')

const redis = require('../../clients/redis')
const { createContext } = require('../../helpers/redis')

describe('redis helpers', () => {
  
  it('saves data with universal id', async () => {
    let contextId = createContext(redis, 'mydata')

    const data = await redis.get(contextId)

    expect(data).eql('mydata')
  })

})
