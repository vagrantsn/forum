const Promise = require('bluebird')

const controllers = require('../controllers')

const actionProcessor = async (req, res) => {
  const { type, actions } = JSON.parse(req.body.payload)

  if( type !== 'interactive_message' ) {
    return res.status(403).send(`unsupported action type: ${type}`)
  }

  let actionsProcessed = []

  let promises = actions.map( async action => {
    let actionProcessor = controllers['actions'][action.name]
    let response = await actionProcessor(req, res, action)

    actionsProcessed.push({
      action,
      response
    })
  })

  await Promise.all(promises)

  res.send(actionsProcessed)
}

module.exports = {
  actionProcessor
}
