const conf = require('../config/index')

const CommentDao = require('../dao/comment')

const commentDao = new CommentDao()

// 发表评论
exports.submitComment = async (req,res) => {
    try {
        let {userName,content,questionId,userId} = req.body
        const result = await commentDao.submitComment({userName,content,questionId,userId})
        res.json(result)
    } catch (error) {
        res.json({
            statusCode:400,
            message:error.toString()
        })
    }
}

// 获取评论列表
exports.getCommentList = async (req,res) => {
    try {
        let {id} = req.params
        let {pageSize=10,currentPage=1,userName,beginTime,endTime,content} = req.query
        const result = await commentDao.getCommentList({questionId:id,pageSize,currentPage,userName,beginTime,endTime,content})
        res.json(result)
    } catch (error) {
        res.json({
            statusCode:400,
            message:error.toString()
        })
    }
}
