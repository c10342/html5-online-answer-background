const Base = require('./base')

const Comments = require('../models/comment')

const Answer = require('../models/answer')

const conf = require('../config/index')

class CommentDao extends Base {
    constructor() {
        super()
        this.Comments = Comments
        this.Answer = Answer
        this.conf = conf
    }

    /**
     * 提交评论
     * 
     * @param {any} {userName,content,questionId,userId} 
     * @returns 
     * @memberof CommentDao
     */
    async submitComment({ userName, content, questionId, userId }) {
        let respone = null
        try {
            const comment = new this.Comments({ userName, content, questionId, userId })
            await comment.save()
            const result = await this.Answer.where({ userId, questionId }).updateOne({ isComment: true })
            respone = {
                statusCode: this.conf.successCode,
                message: '发表成功'
            }
        } catch (error) {
            respone = {
                statusCode: this.conf.errorCode,
                message: error.toString()
            }
        }
        return respone
    }

    /**
     * 获取评论
     * 
     * @param {any} {questionId,pageSize=10,currentPage=1,userName,beginTime,endTime,content} 
     * @returns 
     * @memberof CommentDao
     */
    async getCommentList({ questionId, pageSize = 10, currentPage = 1, userName, beginTime, endTime, content }) {
        let respone = null
        try {
            let params = { questionId, ...this.getParams({ userName, content, beginTime, endTime }) }
            const result = await this.Comments.find(params)
                .skip(pageSize * (currentPage - 1))
                .limit(parseInt(pageSize))
                .sort({ '_id': -1 })
            const total = await this.Comments.countDocuments(params)
            let arr = []
            result.forEach(item => {
                arr.push({
                    userName: item.userName,
                    content: item.content,
                    createTime: item.createTime
                })
            });
            respone = {
                statusCode: this.conf.successCode,
                message: '查询成功',
                data: {
                    commentList: arr,
                    total
                }
            }
        } catch (error) {
            respone = {
                statusCode: this.conf.errorCode,
                message: error.toString()
            }
        }
        return respone
    }
}

module.exports = CommentDao