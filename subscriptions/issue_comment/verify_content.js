const issueComment = require('../../hooks/events/issue_comment')
const { github } = require('../../clients')
const { githubHelper, contentHelper } = require('../../helpers')

const replaceSensitiveInformation = async ({
  issue,
  comment,
  repository,
  sender
}) => {
  const secureComment = contentHelper.hideAuthenticationKeys(comment.body, '[...]')

  const secureImageComment = await contentHelper.hideImagesWithSensibleData(secureComment)

  if (secureImageComment !== comment.body) {
    github.issues.deleteComment({
      owner: repository.owner.login,
      repo: repository.name,
      comment_id: comment.id
    }).catch(err => console.error(`Erro ao excluir o comentário https://github.com/${repository.owner.login}/${repository.name}/issues/${issue.number}#issuecomment-${comment.id}`))


    let notification = `Não compartilhe informações sensíveis de sua conta!\n\n`
    notification += '**Comentário publicado**:\n'
    notification += `\> ${secureImageComment}\n`

    await githubHelper.notifyUserOnIssue(sender.login, notification, {
      number: issue.number,
      repo: repository.name,
      owner: repository.owner.login
    })

    return secureImageComment
  }
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
