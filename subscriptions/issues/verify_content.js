const issues = require('../../hooks/events/issues')
const { github } = require('../../clients')
const { contentHelper, githubHelper } = require('../../helpers')

const replaceSensitiveInformation = async ({ issue, repository }) => {
  const secureIssueTitle = contentHelper.hideAuthenticationKeys(issue.title, '[...]')
  const secureIssueBody = contentHelper.hideAuthenticationKeys(issue.body, '[...]')

  let hasDifference = {
    title: secureIssueTitle !== issue.title,
    body: secureIssueBody !== issue.body
  }

  if( hasDifference.title || hasDifference.body ) {

    github.issues.edit({
      owner: repository.owner.login,
      repo: repository.name,
      number: issue.number,
      title: hasDifference.title? secureIssueTitle : undefined,
      body: hasDifference.body? secureIssueBody : undefined
    })

    let alertComment = 'Não compartilhe informações sensíveis publicamente!'

    if( hasDifference.title ) {
      alertComment += '\n\n**Detectamos informações sensíveis no titulo de sua issue! Por motivos de segurança, faça o reset de suas chaves de autenticação.**'
    }

    githubHelper.notifyUserOnIssue(issue.user.login, alertComment, {
      number: issue.number,
      repo: repository.name,
      owner: repository.owner.login
    })

  }
}

module.exports = {
  replaceSensitiveInformation
}

issues.subscribe(payload => {

  switch(payload.action) {
    case 'opened':
      replaceSensitiveInformation(payload)
  }

}).priority(2)
