const content = require('./content')
const github = require('./github')
const redis = require('./redis')
const slack = require('./slack')
const supporter = require('./supporter')

module.exports = {
  content,
  github,
  redis,
  slack,
  supporter
}
