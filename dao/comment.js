const Base = require('./base')

const Comments = require('../models/comment')

const Answer = require('../models/answer')

const Xss = require('xss')

class CommentDao extends Base {
    constructor() {
        super()
        this.Comments = Comments
        this.Answer = Answer
        this.Xss = Xss
    }

    /**
     * 提交评论
     * 
     * @param {any} {userName,content,questionId,userId} 
     * @returns 
     * @memberof CommentDao
     */
    async submitComment({ userName, content, questionId, userId,title }) {
        try {
            const checked = await this.checkText(content,userId)
            if (checked.spam != 0) {
                throw `您评论的内容包含 ${checked.message} 信息,不能发表`
            }
            content = this.Xss(content)
            const comment = new this.Comments({ userName, content, questionId, userId,title })
            return await comment.save()
        } catch (error) {
            throw error.toString()
        }
    }

    /**
     * 获取评论
     * 
     * @param {any} {questionId,pageSize=10,currentPage=1,userName,beginTime,endTime,content} 
     * @returns 
     * @memberof CommentDao
     */
    async getCommentList({ questionId, pageSize = 10, currentPage = 1, userName, beginTime, endTime, content }) {
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
            return {commentList: arr,total}
        } catch (error) {
            throw error.toString()
        }
    }


    /**
     * 获取用户评论列表
     * 
     * @param {any} { userId, pageSize=10, currentPage=1, beginTime, endTime, content } 
     * @returns 
     * @memberof CommentDao
     */
    async getUserComment({ userId, pageSize=10, currentPage=1, beginTime, endTime, content }) {
        try {
            let params = { userId, ...this.getParams({ content, beginTime, endTime }) }
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
                    createTime: item.createTime,
                    title:item.title
                })
            });
            return {commentList: arr,total}
        } catch (error) {
            throw error.toString()
        }
    }
}

module.exports = CommentDao