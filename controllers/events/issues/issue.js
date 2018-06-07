const redis = require('../../../clients/redis')
const slack = require('../../../clients/slack')
const { sendMessage } = require('../../../helpers/slack')
const { createContext } = require('../../../helpers/redis')

const generateAssignMessage = (issue, repository, callback_id) => Object.assign({
  author_name: issue.user.login,
  title: issue.title,
  title_link: issue.html_url,
  text: issue || 'No description provided.',
  footer: `${repository.full_name} #${issue.number}`,
  callback_id,
  actions: [
    {
      name: 'assign',
      text: 'Assign',
      type: 'button',
      value: 'assign'
    },
    {
      name: 'addlabel',
      text: 'Add Label',
      type: 'select',
      options: [
        {
          text: 'Dúvida',
          value: 'Dúvida'
        },
        {
          text: 'Problema',
          value: 'Problema'
        }
      ]
    }
  ]
})

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

  let contextId = createContext(redis, contextData)

  const assignToIssue = generateAssignMessage(issue, repository, contextId)

  try {
    await sendMessage(slack, {
      channel: process.env.NOTIFICATION_CHANNEL,
      message: 'Issue arrived!',
      attachments: [
        assignToIssue
      ]
    })

    res.status(200).send()
  } catch(e) {
    res.status(500).send('slack connection failed')
  }
}

module.exports = {
  'opened': issue
}
