const { github } = require('../clients')

const notifyUserOnIssue = (user, message, issue) => {
  const { owner, repo, number } = issue

  github.issues.createComment({
    owner,
    repo,
    number,
    body: `@${user} ${message}`
  })
}

module.exports = {
  notifyUserOnIssue
}
