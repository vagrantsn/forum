const octokit = require('@octokit/rest')()
const config = require('../config')

octokit.authenticate({
  type: 'token',
  token: config.get('github').token
})

module.exports = octokit
