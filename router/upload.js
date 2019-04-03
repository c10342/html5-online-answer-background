const express = require('express')

const router = express.Router()

const upload = require('../server/upload')

router.post('/uploadFile',upload.uploadFile)

module.exports = router