const setup = () => {
  process.env.GITHUB_TOKEN = '123'
  process.env.DB_URL = 'mongodb://localhost/testing'
  process.env.NOTIFICATION_CHANNEL = '123'
}

module.exports = setup
