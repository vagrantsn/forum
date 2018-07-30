const issueComment = require('../../hooks/events/issue_comment')
const { github } = require('../../clients')
const { githubHelper } = require('../../helpers')

const hideAuthenticationKeys = (string, replace) => {
  const findKey = /(a|e)k_(live|test)_([0-9A-z])*/g
  return string.replace(findKey, replace)
}

const replaceSensitiveInformation = async ({
  issue,
  comment,
  repository,
  sender
}) => {
  const secureComment = hideAuthenticationKeys(comment.body, '[...]')

  if (secureComment !== comment.body) {
    github.issues.deleteComment({
      owner: repository.owner.login,
      repo: repository.name,
      comment_id: comment.id
    })

    let notification = `Não compartilhe informações sensíveis de sua conta!\n\n`
    notification += '**Comentário publicado**:\n'
    notification += `\> ${secureComment}\n`

    await githubHelper.notifyUserOnIssue(sender.login, notification, {
      number: issue.number,
      repo: repository.name,
      owner: repository.owner.login
    })
  }

  return secureComment
}

module.exports = {
  replaceSensitiveInformation
}

issueComment.subscribe(payload => {
  switch (payload.action) {
    case 'created':
    case 'updated':
      replaceSensitiveInformation(payload)
  }
})
