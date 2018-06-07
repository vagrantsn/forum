const events = require('./events')

const hookPreprocessor = (req, res) => {
  const event = req.headers['x-github-event']
  const { action } = req.body

  if( !events[event] ) {
    return res.status(403).send(`unsupported event ${event}`)
  }

  if( !events[event][action] ) {
    return res.status(403).send(`unsupported action ${action}`)
  }

  let eventProcessor = events[event][action]

  return eventProcessor(req, res)
}

module.exports = {
  hookPreprocessor
}
