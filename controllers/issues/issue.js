const redis = require('../../clients/redis')
const slack = require('../../clients/slack')

const issue = async (req, res) => {
  const {
    action, issue, repository
  } = req.body

  const callback_id = 1
  const attachments = [
    {
      author_name: issue.user.login,
      title: issue.title,
      title_link: issue.html_url,
      text: issue.body.length > 0? `${issue.body.substr(0, 200)}...` : 'No description provided.',
      footer: `${repository.full_name} #${issue.number}`,
      callback_id,
      actions: [
        {
          name: 'assign',
          text: 'Assign',
          type: 'button',
          value: 'assign'
        }
      ]
    }
  ]

  redis.set(callback_id, JSON.stringify({
    repository: {
      name: repository.name,
      owner: repository.owner.login
    },
    issue: {
      title: issue.title,
      number: issue.number,
      url: issue.url
    }
  }))

  slack.chat.postMessage({ channel: process.env.NOTIFICATION_CHANNEL, text: 'Issue arrived!', attachments })
  .then( () => res.send('notified') )
  .catch( () => res.status(500).send('slack connection failed') )
}

module.exports = {
  'opened': issue
}
