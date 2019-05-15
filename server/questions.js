const conf = require('../config/index')

const QuestionDao = require('../dao/question')

const questionDao = new QuestionDao()

// 添加试卷
exports.addQuestion = async (req, res) => {
    try {
        const { title, userName, userId, single, multiple, judgement, answer,checkList,questionType } = req.body
        const result = await questionDao.addQuestion({questionType, checkList,title, userName, userId, single, multiple, judgement, answer })
        res.json({
            statusCode: conf.successCode,
            message: '发布成功'
        })
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString()
        })
    }
}

// 查询所有试卷
exports.getQuestion = async (req, res) => {
    try {
        let { _id, pageSize = 10, currentPage = 1, title, userName, beginTime, endTime,checkList,questionType } = req.query
        const { questionList, total } = await questionDao.getQuestion({ questionType,checkList,_id, pageSize, currentPage, title, userName, beginTime, endTime })
        res.json({
            statusCode: conf.successCode,
            message: '查询成功',
            data: {
                questionList,
                total
            }
        })
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString()
        })
    }
}

// 根据试卷id查询试卷详情
exports.getQuestionById = async (req, res) => {
    try {
        let { id } = req.params
        const { questionList } = await questionDao.getQuestionById({ id })
        res.json({
            statusCode: conf.successCode,
            message: '查询成功',
            data: {
                questionList
            }
        })
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString()
        })
    }
}

// 根据用户id查询用户所发布的所有试卷
exports.getPublishedQuestion = async (req, res) => {
    try {
        let { userId, pageSize = 10, currentPage = 1, title, beginTime, endTime,questionType } = req.query
        const { publishedQuestion, total } = await questionDao.getPublishedQuestion({questionType, userId, pageSize, currentPage, title, beginTime, endTime })
        res.json({
            statusCode: conf.successCode,
            message: '查询成功',
            data: {
                publishedQuestion,
                total
            }
        })
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString()
        })
    }
}

// 根据试卷id获取试卷详细信息
exports.getPublishedQuestionById = async (req, res) => {
    try {
        let { id } = req.params
        const { questionDetail } = await questionDao.getPublishedQuestionById({ id })
        res.json({
            statusCode: conf.successCode,
            message: '查询成功',
            data: {
                questionDetail
            }
        })
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString()
        })
    }
}

// 提交试卷
exports.submitQuestion = async (req, res) => {
    try {
        const { userName, userId, answer, questionId, title, answerTime ,questionType} = req.body
        const result = await questionDao.submitQuestion({ questionType,userName, userId, answer, questionId, title, answerTime })
        res.json({
            statusCode: conf.successCode,
            message: '提交成功'
        })
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString()
        })
    }
}

// 删除试卷
exports.deleteQuestion = async (req, res) => {
    try {
        const { _id } = req.body
        const result = await questionDao.deleteQuestion({ _id })
        res.json({
            statusCode: conf.successCode,
            message: '删除成功',
        })
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString()
        })
    }
}

// 修改试卷
exports.editQuestion = async (req, res) => {
    try {
        let { title, userName, userId, single, multiple, judgement, answer, _id,checkList,questionType } = req.body
        const result = await questionDao.editQuestion({checkList,questionType, title, userName, userId, single, multiple, judgement, answer, _id })
        res.json({
            statusCode: conf.successCode,
            message: '修改成功'
        })
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString()
        })
    }
}

// 根据用户id获取用户所有已经作答的试卷
exports.getAnswerQuestion = async (req, res) => {
    try {
        let { userId, pageSize = 10, currentPage = 1, title, beginTime, endTime,questionType } = req.query
        const { answerList, total } = await questionDao.getAnswerQuestion({ questionType,userId, pageSize, currentPage, title, beginTime, endTime })
        res.json({
            statusCode: conf.successCode,
            message: '查询成功',
            data: {
                answerList,
                total,
            }
        })
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString()
        })
    }
}

// 根据答卷的id查询该答卷的详细信息
exports.getAnswerQuestionById = async (req, res) => {
    try {
        let { id } = req.params
        const { answerDetail } = await questionDao.getAnswerQuestionById({ id })
        res.json({
            statusCode: conf.successCode,
            message: '查询成功',
            data: {
                answerDetail
            }
        })
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString()
        })
    }
}

