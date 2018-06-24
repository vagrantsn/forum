const { WebClient } = require('@slack/client')
const config = require('../config')

module.exports = new WebClient(config.get('slack').token)
