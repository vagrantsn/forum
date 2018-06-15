const redis = require('../../../clients/redis')
const slack = require('../../../clients/slack')
const github = require('../../../clients/github')
const { sendMessage } = require('../../../helpers/slack')
const { createContext } = require('../../../helpers/redis')
const Supporter = require('../../../helpers/supporter.js')

const generateAssignMessage = (issue, repository, callback_id) => {
  message = {
    author_name: issue.user.login,
    title: issue.title,
    title_link: issue.html_url,
    text: issue || 'No description provided.',
    footer: `${repository.full_name} #${issue.number}`,
    callback_id
  }

  return message;
}

const generateActions = () => {
  return [
    {
      name: 'assign',
      text: 'Assign',
      type: 'button',
      value: 'assign'
    }
  ]
}

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
  const nextSupporter = await Supporter.getNextSupporter()
  const assignMessage = generateAssignMessage(issue, repository, contextId)
  const channel = !nextSupporter ? process.env.NOTIFICATION_CHANNEL : nextSupporter.slack_id

  if ( !nextSupporter ) {
    assignMessage.actions = generateActions()
  } else {
    await github.issues.addAssigneesToIssue({
      owner: repository.owner.login,
      repo: repository.name,
      number: issue.number,
      assignees: [
        nextSupporter.user
      ]
    })
      .then( (res) =>  console.log('Issue atribuida à ', res.data.assignee.login) )
      .catch( (err) => console.log(err) )
  }

  try {
    await sendMessage(slack, {
      channel: channel,
      message: 'Issue arrived!',
      attachments: [
        assignMessage
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
