const controllers = require('../controllers')

const hookPreprocessor = (req, res) => {
  const event = req.headers['x-github-event']

  if( !controllers[event] ) {
    return res.status(403).send(`unsupported event ${event}`)
  }

  let eventProcessor = controllers[event]

  return eventProcessor(req, res)
}

module.exports = {
  hookPreprocessor
}