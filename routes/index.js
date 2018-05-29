const express = require('express')

const { hookPreprocessor } = require('../helpers/hook')
const controllers = require('../controllers')

const router = express.Router()

router.post('/hooks', hookPreprocessor)

module.exports = router