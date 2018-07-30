const express = require('express')
const router = express.Router()

const hooks = require('../hooks')
const slackActions = require('../slackActions')

router.post('/hooks', (req, res) => {
  for (let hook in hooks) {
    hooks[hook].process(req, res)
  }

  res.send('ok')
})

router.post('/actions', (req, res) => {
  let { payload } = req.body
  payload = JSON.parse(payload)
  const { actions } = payload

  actions.map(action => {
    let fn = slackActions[action.name]
    fn(payload)
  })

  res.send()
})

module.exports = router
