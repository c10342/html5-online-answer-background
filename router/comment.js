const express = require('express')

const router = express.Router()

const comment = require('../server/comment')

// 用户发表评论
router.post('/submitComment',comment.submitComment)

// 获取评论
router.get('/getCommentList/:id',comment.getCommentList)

// 获取用户发表评论
router.get('/getUserComment/',comment.getUserComment)



module.exports = router

