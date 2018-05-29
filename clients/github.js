const octokit = require('@octokit/rest')()

octokit.authenticate({
  type: 'oauth',
  token: process.env.GITHUB_TOKEN
})

module.exports = octokit
