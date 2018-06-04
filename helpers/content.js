const hasEncryptionKey = string => string.match(/ek_(live|test)_([0-9A-z])/g) !== null
const hasApiKey = string => string.match(/ak_(live|test)_([0-9A-z])/g) !== null

const hideAuthenticationKeys = (string, replace) => {
  const findKey = /(a|e)k_(live|test)_([0-9A-z])*/g
  return string.replace(findKey, replace)
}

module.exports = {
  hasApiKey,
  hasEncryptionKey,
  hideAuthenticationKeys
}
