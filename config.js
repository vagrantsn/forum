const convict = require('convict')

const config = convict({
  mongo: {
    db: {
      default: '',
      env: 'MONGO_DB'
    },
    host: {
      default: 'localhost',
      env: 'MONGO_HOST'
    },
    port: {
      default: 27017,
      env: 'MONGO_PORT'
    }
  },
  redis: {
    host: {
      default: 'localhost',
      env: 'REDIS_HOST'
    },
    database: {
      default: 0,
      env: 'REDIST_DATABASE'
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
