const controllers = require('../controllers')

const hookPreprocessor = (req, res) => {
  const event = req.headers['x-github-event']
  const { action } = req.body

  if( !controllers[event] ) {
    return res.status(403).send(`unsupported event ${event}`)
  }

  if( !controllers[event][action] ) {
    return res.status(403).send(`unsupported action ${action}`)
  }

  let eventProcessor = controllers[event][action]

  return eventProcessor(req, res)
}

module.exports = {
  hookPreprocessor
}