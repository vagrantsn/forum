const { github } = require('../clients')

const notifyUserOnIssue = (user, message, { number, repo, owner }) => github.issues.createComment({
  owner,
  repo,
  number,
  body: `@${user} ${message}`
})

module.exports = {
  notifyUserOnIssue
}
