const issues = require('../../hooks/events/issues')
const config = require('../../config')
const {
  contentHelper,
  githubHelper,
  slackHelper,
  redisHelper
} = require('../../helpers')

const ALERT_LEVEL = {
  NONE: 0,
  MEDIUM: 1,
  HIGH: 2
}

const hasSensitiveContent = string =>
  contentHelper.hasEncryptionKey(string) || contentHelper.hasApiKey(string)

const getAlertLevel = issue => {
  let alertLevel = ALERT_LEVEL.NONE

  if (hasSensitiveContent(issue.body)) {
    alertLevel = ALERT_LEVEL.MEDIUM
  }

  if (hasSensitiveContent(issue.title)) {
    alertLevel = ALERT_LEVEL.HIGH
  }

  return alertLevel
}

const generateNotificationAttachment = issue => {
  let alertLevel = getAlertLevel(issue)

  let title = issue.title
  let text = issue.body
  let fields = []

  if (alertLevel === ALERT_LEVEL.MEDIUM) {
    title = 'Issue created with sensitive content!'
    text = contentHelper.hideAuthenticationKeys(issue.body, '[...]')
    fields = [
      {
        title: 'Priority',
        value: 'Medium',
        short: false
      }
    ]
  }

  if (alertLevel === ALERT_LEVEL.HIGH) {
    title = 'Issue created with sensitive content on title!'
    text = contentHelper.hideAuthenticationKeys(issue.title, '[...]')
    fields = [
      {
        title: 'Priority',
        value: 'High',
        short: false
      }
    ]
  }

  let attachment = {
    title_link: issue.html_url,
    title,
    text,
    fields
  }

  return attachment
}

const notifyOnSlack = ({ issue, repository }) => {
  let alertLevel = ALERT_LEVEL.none

  let slackNotification = {
    channel: config.get('slack').channels.notification,
    text: 'New Issue!'
  }

  if (hasSensitiveContent(issue.body)) {
    alertLevel = ALERT_LEVEL.medium
    delete slackNotification.text
  }

  if (hasSensitiveContent(issue.title)) {
    alertLevel = ALERT_LEVEL.high
    delete slackNotification.text
  }

  let attachment = generateNotificationAttachment(issue, alertLevel)
  attachment.author_name = `${repository.full_name} #${issue.number}`
  attachment.author_link = issue.html_url

  if (issue.assignees.length === 0) {
    let callback_id = redisHelper.createContext(
      JSON.stringify({
        repository: {
          name: repository.name,
          owner: repository.owner.login
        },
        issue: {
          number: issue.number
        }
      })
    )

    ;(attachment.callback_id = callback_id),
    (attachment.actions = [
      {
        name: 'assign',
        text: 'Assign',
        type: 'button',
        value: 'assign'
      }
    ])
  }

  slackNotification.attachments = [attachment]

  slackHelper.sendMessage(slackNotification)
}

issues
  .subscribe(payload => {
    const { action } = payload

    switch (action) {
    case 'opened':
      notifyOnSlack(payload)
    }
  })
  .priority(1)

module.exports = {
  notifyOnSlack,
  generateNotificationAttachment
}
