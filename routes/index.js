const express = require('express')

const { hookPreprocessor } = require('../helpers/hook')
const { actionProcessor } = require('../helpers/action')

const controllers = require('../controllers')

const router = express.Router()

router.post('/hooks', hookPreprocessor)

router.post('/actions', actionProcessor)

module.exports = router