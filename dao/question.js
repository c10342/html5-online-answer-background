const Base = require('./base')

const Questions = require('../models/questions')

const User = require('../models/user')

const Answers = require('../models/answer')

const Comments = require('../models/comment')

const util = require('../util/index')

const conf = require('../config/index')

class QusetionDao extends Base {
    constructor() {
        super()
        this.Questions = Questions
        this.User = User
        this.Comments = Comments
        this.util = util
        this.conf = conf
        this.Answers = Answers
    }

    /**
     * 添加试卷
     * 
     * @param {any} { title, userName, userId, single, multiple, judgement, answer } 
     * @returns 
     * @memberof QusetionDao
     */
    async addQuestion({ title, userName, userId, single, multiple, judgement, answer }) {
        let respone = null
        try {
            const question = new this.Questions({
                title,
                userName,
                userId,
                single,
                multiple,
                judgement,
                answer
            })
            const userRes = await this.User.findById(userId)
            if (userRes) {
                const result = await question.save()
                respone = {
                    statusCode: this.conf.successCode,
                    message: '发布成功'
                }
            } else {
                respone = {
                    statusCode: this.conf.errorCode,
                    message: '用户不存在,请检查登录状态'
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

    /**
     * 查询所有试卷
     * 
     * @param {any} { _id, pageSize = 10, currentPage = 1, title, userName, beginTime, endTime } 
     * @returns 
     * @memberof QusetionDao
     */
    async getQuestion({ _id, pageSize = 10, currentPage = 1, title, userName, beginTime, endTime }) {
        let respone = null
        try {
            let params = this.getParams({
                title,
                userName,
                beginTime,
                endTime
            })
            const answerRes = await this.Answers.find({
                userId: _id
            }).select('questionId')
            const count = await this.Questions.countDocuments(params)
            const result = await this.Questions.find(params)
                .skip(pageSize * (currentPage - 1))
                .limit(parseInt(pageSize))
                .sort({
                    '_id': -1
                })
            let arr = []
            result.forEach((item) => {
                let totalCount = item.single.count + item.multiple.count + item.judgement.count + item.answer.count
                let isAnswer = answerRes.findIndex(i => i.questionId == item._id.toString()) > -1 ? true : false
                arr.push({
                    title: item.title,
                    userName: item.userName,
                    createTime: item.createTime,
                    singleCount: item.single.count,
                    multipleCount: item.multiple.count,
                    judgementCount: item.judgement.count,
                    answerCount: item.answer.count,
                    isAnswer,
                    _id: item._id,
                    totalCount
                })
            })
            respone = {
                statusCode: this.conf.successCode,
                message: '查询成功',
                data: {
                    questionList: arr,
                    total: count
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

    /**
     * 根据试卷id查询试卷详情
     * 
     * @param {any} { id } 
     * @returns 
     * @memberof QusetionDao
     */
    async getQuestionById({ id }) {
        let respone = null
        try {
            const result = await this.Questions.findById(id)
            if (result) {
                result.answer.question.forEach(i => {
                    i.answer = ''
                })
                result.judgement.question.forEach(i => {
                    i.answer = ''
                })
                result.multiple.question.forEach(i => {
                    i.answer = []
                })
                result.single.question.forEach(i => {
                    i.answer = ''
                })
                let obj = {
                    title: result.title,
                    singleQuestion: result.single.question,
                    multipleQuestion: result.multiple.question,
                    answerQuestion: result.answer.question,
                    judgementQuestion: result.judgement.question,
                }
                respone = {
                    statusCode: this.conf.successCode,
                    message: '查询成功',
                    data: {
                        questionList: obj
                    }
                }
            } else {
                respone = {
                    statusCode: this.conf.errorCode,
                    message: '查询失败,没有此试卷',
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

    /**
     * 根据用户id查询用户所发布的所有试卷
     * 
     * @param {any} { userId, pageSize = 10, currentPage = 1, title, beginTime, endTime } 
     * @returns 
     * @memberof QusetionDao
     */
    async getPublishedQuestion({ userId, pageSize = 10, currentPage = 1, title, beginTime, endTime }) {
        let respone = null
        try {
            let params = {
                userId,
                ...this.getParams({
                    title,
                    beginTime,
                    endTime
                })
            }
            const count = await this.Questions.countDocuments(params)
            const result = await this.Questions.find(params)
                .skip(pageSize * (currentPage - 1))
                .limit(parseInt(pageSize))
                .sort({
                    '_id': -1
                })
            let arr = []
            result.forEach(item => {
                let totalCount = item.single.count + item.multiple.count + item.judgement.count + item.answer.count
                arr.push({
                    _id: item._id,
                    title: item.title,
                    singleCount: item.single.count,
                    multipleCount: item.multiple.count,
                    judgementCount: item.judgement.count,
                    answerCount: item.answer.count,
                    userName: item.userName,
                    createTime: item.createTime,
                    totalCount
                })
            })
            respone = {
                statusCode: this.conf.successCode,
                message: '查询成功',
                data: {
                    publishedQuestion: arr,
                    total: count
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

    /**
     * 根据试卷id获取试卷详细信息
     * 
     * @param {any} { id } 
     * @returns 
     * @memberof QusetionDao
     */
    async getPublishedQuestionById({ id }) {
        let respone = null
        try {
            const result = await this.Questions.findById({
                _id: id
            })
            let obj = {}
            if (result) {
                obj.title = result.title
                obj.single = result.single.question
                obj.multiple = result.multiple.question
                obj.judgement = result.judgement.question
                obj.answer = result.answer.question
                respone = {
                    statusCode: this.conf.successCode,
                    message: '查询成功',
                    data: {
                        questionDetail: obj,
                    }
                }
            } else {
                respone = {
                    statusCode: this.conf.errorCode,
                    message: '查询失败,没有此试卷',
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

    /**
     * 保存用户做题的答案
     * 
     * @param {any} { userName, userId,answer, questionId,title } 
     * @returns 
     * @memberof QusetionDao
     */
    async submitQuestion({ userName, userId, answer, questionId, title,answerTime }) {
        let respone = null
        try {
            const myAnswer = new this.Answers({
                userName,
                userId,
                answer,
                questionId,
                title,
                answerTime
            })
            const result = await myAnswer.save()
            respone = {
                statusCode: this.conf.successCode,
                message: '提交成功'
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
     * 删除试卷
     * 
     * @param {any} { _id } 
     * @returns 
     * @memberof QusetionDao
     */
    async deleteQuestion({ _id }) {
        let respone = null
        try {
            const qResult = await this.Questions.deleteMany({
                _id
            })
            const aResult = await this.Answers.deleteMany({
                questionId: _id
            })
            const cResult = await this.Comments.deleteMany({
                questionId: _id
            })
            respone = {
                statusCode: this.conf.successCode,
                message: '删除成功',
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
     * 根据试卷id编辑试卷
     * 
     * @param {any} { title, userName, userId, single, multiple, judgement, answer, _id } 
     * @returns 
     * @memberof QusetionDao
     */
    async editQuestion({ title, userName, userId, single, multiple, judgement, answer, _id }) {
        let respone = null
        try {
            const qResult = await this.Questions.where({
                _id
            }).updateOne({
                title,
                userName,
                userId,
                single,
                multiple,
                judgement,
                answer
            })
            const aResult = await this.Answers.where({
                questionId: _id
            }).updateMany({
                title,
                userName,
                userId
            })
            respone = {
                statusCode: this.conf.successCode,
                message: '修改成功'
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
     * 根据用户id获取用户所有已经作答的试卷
     * 
     * @param {any} { userId, pageSize = 10, currentPage = 1, title, beginTime, endTime } 
     * @returns 
     * @memberof QusetionDao
     */
    async getAnswerQuestion({ userId, pageSize = 10, currentPage = 1, title, beginTime, endTime }) {
        let respone = null
        try {
            let params = {
                userId,
                ...this.getParams({
                    title,
                    beginTime,
                    endTime
                })
            }
            //子表关联主表查询，populate里面为子表外键
            const result = await this.Answers.find(params)
                .skip(pageSize * (currentPage - 1))
                .limit(parseInt(pageSize))
                .sort({
                    '_id': -1
                })
                .populate('questionId')
            const total = await this.Answers.countDocuments(params)
            let data = this.statisticsQuestion({ result })
            if (result) {
                respone = {
                    statusCode: this.conf.successCode,
                    message: '查询成功',
                    data: {
                        answerList: data,
                        total,
                    }
                }
            } else {
                respone = {
                    statusCode: this.conf.errorCode,
                    message: '查询失败',
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

    /**
     * 根据答卷的id查询该答卷的详细信息
     * 
     * @param {any} { id } 
     * @returns 
     * @memberof QusetionDao
     */
    async getAnswerQuestionById({ id }) {
        let respone = null
        try {
            //子表关联主表查询，populate里面为子表外键
            const item = await this.Answers.findById({
                _id: id
            }).populate('questionId')
            if (item) {
                // 单选题
                let single = item.questionId.single
                let singleQuestion = single.question
                singleQuestion.forEach(q => {
                    if (item.answer[q.id] && item.answer[q.id] == single.answer[q.id]) {
                        q.message = '正确'
                    } else {
                        q.message = `错误,正确答案是:${q.answer}`
                    }
                    if (!item.answer[q.id]) {
                        q.message = `试卷已经被修改,该题是新增加的,正确答案是:${q.answer}`
                    }
                    q.answer = item.answer[q.id] ? item.answer[q.id] : ''
                })

                // 多选题
                let multiple = item.questionId.multiple
                let multipleQuestion = multiple.question
                multipleQuestion.forEach(q => {
                    if (item.answer[q.id] && item.answer[q.id].sort().toString() == multiple.answer[q.id]) {
                        q.message = '正确'
                    } else {
                        q.message = `错误,正确答案是:${q.answer}`
                    }
                    if (!item.answer[q.id]) {
                        q.message = `试卷已经被修改,该题是新增加的,正确答案是:${q.answer}`
                    }
                    q.answer = item.answer[q.id] ? item.answer[q.id] : []
                })

                // 判断题
                let judgement = item.questionId.judgement
                let judgementQuestion = judgement.question
                judgementQuestion.forEach(q => {
                    if (item.answer[q.id] && item.answer[q.id] == judgement.answer[q.id]) {
                        q.message = '正确'
                    } else {
                        q.message = `错误,正确答案是:${q.answer == 'A' ? '对' : '错'}`
                    }
                    if (!item.answer[q.id]) {
                        q.message = `试卷已经被修改,该题是新增加的,正确答案是:${q.answer == 'A' ? '对' : '错'}`
                    }
                    q.answer = item.answer[q.id] ? item.answer[q.id] : ''
                })

                // 简答题
                let answer = item.questionId.answer
                let answerQuestion = answer.question
                answerQuestion.forEach(q => {
                    if (item.answer[q.id] && this.util.strSimilarity2Percent(item.answer[q.id], answer.answer[q.id]) > 0.5) {
                        q.message = `正确,参考答案是:${q.answer}`
                    } else {
                        q.message = `错误,正确答案是:${q.answer}`
                    }
                    if (!item.answer[q.id]) {
                        q.message = `试卷已经被修改,该题是新增加的,正确答案是:${q.answer}`
                    }
                    q.answer = item.answer[q.id] ? item.answer[q.id] : ''
                })
                let obj = {
                    title: item.questionId.title,
                    answer: item.questionId.answer,
                    single: item.questionId.single,
                    multiple: item.questionId.multiple,
                    judgement: item.questionId.judgement
                }
                respone = {
                    statusCode: this.conf.successCode,
                    message: '查询成功',
                    data: {
                        answerDetail: obj,
                    }
                }
            } else {
                respone = {
                    statusCode: this.conf.errorCode,
                    message: '查询失败,没有此试卷',
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

module.exports = QusetionDao