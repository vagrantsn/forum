const github = require('./github')
const slack = require('./slack')
const redis = require('./redis')

module.exports = {
  github,
  slack,
  redis
}
