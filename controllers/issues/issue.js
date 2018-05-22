const slack = require('../../clients/slack')

const issue = async (req, res) => {
  const {
    action, issue, repository
  } = req.body

  const attachments = [
    {
      author_name: issue.user.login,
      title: issue.title,
      title_link: issue.html_url,
      text: issue.body.length > 0? `${issue.body.substr(0, 200)}...` : 'No description provided.',
      footer: `${repository.full_name} #${issue.number}`
    }
  ]

  slack.chat.postMessage({ channel: process.env.NOTIFICATION_CHANNEL, text: 'Issue arrived!', attachments })
  .then( () => res.send('notified') )
  .catch( () => res.status(500).send('slack connection failed') )
}

module.exports = {
  'opened': issue
}