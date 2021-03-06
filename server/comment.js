const conf = require('../config/index')

const CommentDao = require('../dao/comment')

const commentDao = new CommentDao()

// 发表评论
exports.submitComment = async (req, res) => {
    try {
        let { userName, content, questionId, userId,title } = req.body
        const result = await commentDao.submitComment({ userName, content, questionId, userId,title })
        res.json({
            statusCode: conf.successCode,
            message: '发表成功'
        })
    } catch (error) {
        res.json({
            statusCode: 400,
            message: error.toString()
        })
    }
}

// 获取评论列表
exports.getCommentList = async (req, res) => {
    try {
        let { id } = req.params
        let { pageSize = 10, currentPage = 1, userName, beginTime, endTime, content,questionType } = req.query
        const { commentList, total } = await commentDao.getCommentList({ questionId: id, pageSize,questionType, currentPage, userName, beginTime, endTime, content })
        res.json({
            statusCode: conf.successCode,
            message: '查询成功',
            data: {
                commentList,
                total
            }
        })
    } catch (error) {
        res.json({
            statusCode: 400,
            message: error.toString()
        })
    }
}


// 获取用户评论列表
exports.getUserComment = async (req, res) => {
    try {
        let { title,pageSize = 10, currentPage = 1, beginTime, endTime, content,id } = req.query
        const { commentList, total } = await commentDao.getUserComment({ userId: id, pageSize, currentPage, beginTime,endTime, content,title })
        res.json({
            statusCode: conf.successCode,
            message: '查询成功',
            data: {
                commentList,
                total
            }
        })
    } catch (error) {
        res.json({
            statusCode: 400,
            message: error.toString()
        })
    }
}

// 回复用户评论
exports.submitReply = async (req, res) => {
    try {
        let { userName,commentId, userId, replyId, content } = req.body
        await commentDao.submitReply({ userName,commentId, userId, replyId, content})
        res.json({
            statusCode: conf.successCode,
            message: '回复成功',
        })
    } catch (error) {
        res.json({
            statusCode: 400,
            message: error.toString()
        })
    }
}

// 获取回复列表
exports.getReplyList = async (req, res) => {
    try {
        let { pageSize = 10, currentPage = 1, beginTime, endTime, content,commentId } = req.query
        const {replyList,total} = await commentDao.getReplyList({ pageSize , currentPage , beginTime, endTime, content,commentId})
        res.json({
            statusCode: conf.successCode,
            message: '回复成功',
            data:{replyList,total}
        })
    } catch (error) {
        res.json({
            statusCode: 400,
            message: error.toString()
        })
    }
}
