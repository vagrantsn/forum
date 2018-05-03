const hideAuthenticationKeys = (string, replace) => {
  const findKey = /(a|e)k_(live|test)_([0-9A-z])*/g
  return string.replace(findKey, replace)
}

module.exports = {
  hideAuthenticationKeys
}