const express = require('express')
const controllers = require('../controllers')

const router = express.Router()

router.post('/hooks/issue/comment', (req, res) => {
  controllers.issues(req, res)
})

module.exports = router