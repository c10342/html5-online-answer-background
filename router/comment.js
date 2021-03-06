const express = require('express')

const router = express.Router()

const comment = require('../server/comment')

// 用户发表评论
router.post('/submitComment',comment.submitComment)

// 获取评论
router.get('/getCommentList/:id',comment.getCommentList)

// 获取用户发表评论
router.get('/getUserComment',comment.getUserComment)

// 回复用户评论
router.post('/submitReply',comment.submitReply)

// 获取回复列表
router.get('/getReplyList',comment.getReplyList)



module.exports = router

