const convict = require('convict')

const config = convict({
  mongoUrl: {
    default: 'localhost',
    env: 'MONGO_URL'
  },
  redis: {
    host: {
      default: 'localhost',
      env: 'REDIS_HOST'
    },
    port: {
      default: 6379,
      env: 'REDIS_PORT'
    }
  },
  github: {
    token: {
      default: null,
      env: 'GITHUB_TOKEN'
    }
  },
  slack: {
    token: {
      default: null,
      env: 'SLACK_TOKEN'
    },
    channels: {
      notification: {
        default: null,
        env: 'NOTIFICATION_CHANNEL'
      }
    }
  }
})

module.exports = config
