const comments = (req, res, next) => {
  res.send('Hello, world!')
}

const issuesController = (req, res, next) => {
  const event = req.headers['x-github-event']

  switch(event) {
    case 'issue_comment':
      return comments(req, res, next)
    default:
      return res.status(403).send(`Issue Controller: invalid event ${event}`)
  }
}

module.exports = issuesController