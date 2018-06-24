const { github } = require('../../../clients')

const {
  slack,
  redis,
  supporter,
  content,
  github: githubHelper
} = require('../../../helpers')

const config = require('../../../config')

const generateAssignMessage = (issue, repository, callback_id) => ({
  author_name: issue.user.login,
  title: issue.title,
  title_link: issue.html_url,
  text: issue || 'No description provided.',
  footer: `${repository.full_name} #${issue.number}`,
  callback_id
})

const generateActions = () => ([
  {
    name: 'assign',
    text: 'Assign',
    type: 'button',
    value: 'assign'
  }
])

const issue = async (req, res) => {
  const {
    action, issue, repository
  } = req.body

  let contextData = JSON.stringify({
    repository: {
      name: repository.name,
      owner: repository.owner.login
    },
    issue: {
      title: issue.title,
      number: issue.number,
      url: issue.url
    }
  })

  const contextId = redis.createContext(contextData)
  const assignMessage = generateAssignMessage(issue, repository, contextId)
  assignMessage.actions = generateActions()

  const nextSupporter = await supporter.getNextSupporter()

  let slackNotification = {
    channel: !nextSupporter ? config.get('slack').channels.notification : nextSupporter.slack_id,
    attachments: [
      assignMessage
    ]
  }

  if ( nextSupporter.user ) {
    assignMessage.actions = []

    github.issues.addAssigneesToIssue({
      owner: repository.owner.login,
      repo: repository.name,
      number: issue.number,
      assignees: [
        nextSupporter.user
      ]
    }).catch( e => console.log(e) )
  }

  const secureIssueTitle = content.hideAuthenticationKeys(issue.title, '[...]')
  const secureIssueBody = content.hideAuthenticationKeys(issue.body, '[...]')

  let hasDifference = {
    title: secureIssueTitle !== issue.title,
    body: secureIssueBody !== issue.body
  }

  if( hasDifference.title || hasDifference.body ) {

    github.issues.edit({
      owner: repository.owner.login,
      repo: repository.name,
      number: issue.number,
      title: hasDifference.title? secureIssueTitle : null,
      body: hasDifference.body? secureIssueBody : null
    }).catch( e => console.log(e) )

    let alertComment = 'Não compartilhe informações sensíveis publicamente!'

    if( hasDifference.title ) {
      alertComment += '\n\n**Detectamos informações sensíveis no titulo de sua issue! Por motivos de segurança, faça o reset de suas chaves de autenticação.**'
    }

    githubHelper.notifyUserOnIssue(issue.user.login, alertComment, {
      number: issue.number,
      repo: repository.name,
      owner: repository.owner.login
    }).catch( e => console.log(e) )

    slackNotification = {
      channel: config.get('slack').channels.notification,
      attachments: [{
        author_name: `${repository.full_name} #${issue.number}`,
        author_link: issue.html_url,
        title: 'Issue created with sensitive content!',
        title_link: issue.html_url,
        text: secureIssueBody,
        fiels: [{
          title: "Priority",
          value: "High",
          short: false
        }]
      }]
    }

  }

  try {
    await slack.sendMessage(slackNotification)
    res.status(200).send('slack notification succeeded')
  } catch(e) {
    res.status(500).send('slack notification failed')
  }
}

module.exports = {
  'opened': issue
}
