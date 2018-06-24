const github = require('../../../clients/github')

const { hideAuthenticationKeys } = require('../../../helpers/content')
const { notifyUserOnIssue } = require('../../../helpers/github')

const comment = async (req, res, next) => {
  const {
    action, issue, comment, repository, sender 
  } = req.body

  let publicComment = hideAuthenticationKeys(comment.body, '[...]')

  if( publicComment !== comment.body ) {
    let notification  = `Não compartilhe informações sensíveis de sua conta!\n\n`
    notification     += '**Comentário publicado**:\n'
    notification     += `\> ${publicComment}\n`

    await github.issues.deleteComment({
      owner: repository.owner.login,
      repo: repository.name,
      id: comment.id
    })

    await notifyUserOnIssue(sender.login, notification, {
      number: issue.number,
      repo: repository.name,
      owner: repository.owner.login
    })
  }

  return res.send('issue comment verified')
}

module.exports = {
  'created': comment,
  'edited': comment
}
