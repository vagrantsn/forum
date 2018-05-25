const controllers = require('../controllers')

const actionProcessor = (req, res) => {
  const { type, actions } = req.body

  if( type !== 'interactive_message' ) {
    return res.status(403).send(`unsupported action type: ${type}`)
  }

  let actionsProcessed = []
  actions.forEach( action => {
    let actionProcessor = controllers['actions'][action.name]

    let actionResult = actionProcessor(req, res, action)

    actionsProcessed.push({
      action,
      response: actionResult
    })
  })

  res.send(actionsProcessed)
}

module.exports = {
  actionProcessor
}