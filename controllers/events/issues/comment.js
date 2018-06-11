const github = require('../../../clients/github')

const { hideAuthenticationKeys } = require('../../../helpers/content')

const comment = async (req, res, next) => {
  const {
    action, issue, comment, repository, sender 
  } = req.body

  let publicComment = hideAuthenticationKeys(comment.body, '[...]')

  if( publicComment !== comment.body ) {
    let alertComment = `@${sender.login} Não compartilhe informações sensíveis publicamente! `
    alertComment += 'Comentário publicado: \n'
    alertComment += `\> ${publicComment}\n`

    await github.issues.deleteComment({
      owner: repository.owner.login,
      repo: repository.name,
      id: comment.id
    })

    await github.issues.createComment({
      owner: repository.owner.login,
      repo: repository.name,
      number: issue.number,
      body: alertComment
    })
  }

  res.send('ok')
}

module.exports = {
  'created': comment,
  'edited': comment
}
