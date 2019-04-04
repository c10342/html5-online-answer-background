const express = require('express')

const router = express.Router()

const downLoad = require('../server/downLoad')

router.get('/downLoadTemplate',downLoad.downLoadTemplate)

module.exports = router