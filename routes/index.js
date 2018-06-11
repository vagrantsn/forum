const express = require('express')

const { hookPreprocessor } = require('../controllers/hook')
const { actionPreprocessor } = require('../controllers/slackAction')

const router = express.Router()

router.post('/hooks', hookPreprocessor)

router.post('/actions', actionPreprocessor)

module.exports = router
