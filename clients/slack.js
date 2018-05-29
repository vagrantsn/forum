const { WebClient } = require('@slack/client')

module.exports = new WebClient(process.env.SLACK_TOKEN)
