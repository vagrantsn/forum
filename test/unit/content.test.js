const chai = require('chai')

const expect = chai.expect

const {
  hasApiKey,
  hasEncryptionKey,
  hideAuthenticationKeys 
} = require('../../helpers/content')

describe('content helpers', () => {
  let replacement

  beforeEach( () => {
    replacement = 'hidden content'
  })

  it('matches api key', () => {
    expect(hasApiKey('ak_test_b5sa987')).to.eql(true)
    expect(hasApiKey('ik_live_1sdw1xxv')).to.eql(false)
    expect(hasApiKey('ak_test_Qqsa84as')).to.eql(true)
  })

  it('matches encryption key', () => {
    expect(hasEncryptionKey('ek_test_123qwe')).to.eql(true)
    expect(hasEncryptionKey('ek_live_123qwe')).to.eql(true)
    expect(hasEncryptionKey('uk_test_123qwe')).to.eql(false)
  });

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
