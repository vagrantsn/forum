const chai = require('chai')

const expect = chai.expect

const { hideAuthenticationKeys } = require('../../helpers/content')

describe('content helpers', () => {
  let replacement

  beforeEach( () => {
    replacement = 'hidden content'
  })

  it('hides API Key from text', () => {
    const key = 'ak_live_123qwe'
    let original = 'some content ' + key

    let string = hideAuthenticationKeys(original, replacement)
    
    expect(string.indexOf(key)).to.eql(-1)
  })

  it('hides Encryption key from text', () => {
    const key = 'ek_live_qo123kwl'
    let original = 'some content ' + key
    
    let string = hideAuthenticationKeys(original, replacement)

    expect(string.indexOf(key)).to.eql(-1)
  })

  it('replaces hidden data with string', () => {
    let original = 'some content qweqwe qwe 123 334 ak_test_1ijawei23'

    let string = hideAuthenticationKeys(original, replacement)

    expect(string.indexOf('ak_test_lijawei23')).to.eql(-1)
    expect(string).to.eql('some content qweqwe qwe 123 334 hidden content')
  })

})