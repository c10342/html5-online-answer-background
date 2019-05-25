const conf = require('../config/index')

const QuestionDao = require('../dao/question')

const questionDao = new QuestionDao()

// 添加试卷
exports.addQuestion = async (req, res) => {
    try {
        const { title, userName, userId, single, multiple, judgement, answer, checkList, questionType, flag } = req.body
        const result = await questionDao.addQuestion({ questionType, checkList, title, userName, userId, single, multiple, judgement, answer, flag })
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
        let { _id, pageSize = 10, currentPage = 1, title, userName, beginTime, endTime, checkList, questionType } = req.query
        const { questionList, total } = await questionDao.getQuestion({ questionType, checkList, _id, pageSize, currentPage, title, userName, beginTime, endTime })
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
        let { userId, pageSize = 10, currentPage = 1, title, beginTime, endTime, questionType } = req.query
        const { publishedQuestion, total } = await questionDao.getPublishedQuestion({ questionType, userId, pageSize, currentPage, title, beginTime, endTime })
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
        const { userName, userId, answer, questionId, title, answerTime, questionType, singleQuestion, multipleQuestion, judgementQuestion, answerQuestion,flag } = req.body
        const result = await questionDao.submitQuestion({ questionType, userName, userId, answer, questionId, title, answerTime, singles:singleQuestion, multiples:multipleQuestion, judgements:judgementQuestion, answers:answerQuestion,flag })
        res.json({
            statusCode: conf.successCode,
            message: '提交成功',
            data:{
                result
            }
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
        let { title, userName, userId, single, multiple, judgement, answer, _id, checkList, questionType } = req.body
        const result = await questionDao.editQuestion({ checkList, questionType, title, userName, userId, single, multiple, judgement, answer, _id })
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
        let { userId, pageSize = 10, currentPage = 1, title, beginTime, endTime, questionType } = req.query
        const { answerList, total } = await questionDao.getAnswerQuestion({ questionType, userId, pageSize, currentPage, title, beginTime, endTime })
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

// 查询错题
exports.getMistake = async (req, res) => {
    try {
        const { userId, types, currentPage = 1, pageSize = 10, beginTime, endTime, title } = req.query
        const { mistakeList, total } = await questionDao.getMistake({ userId, types, currentPage, pageSize, beginTime, endTime, title })
        res.json({
            statusCode: conf.successCode,
            message: '查询成功',
            data: {
                mistakeList, total
            }
        })
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString()
        })
    }
}


// 收藏试题
exports.collectQuestion = async (req, res) => {
    try {
        const { userId, questionId } = req.query
        const result = await questionDao.collectQuestion({ userId, questionId })
        res.json({
            statusCode: conf.successCode,
            message: '收藏成功',
        })
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString()
        })
    }
}


// 取消收藏试题
exports.cancelCollectQuestion = async (req, res) => {
    try {
        const { userId, questionId } = req.query
        const result = await questionDao.cancelCollectQuestion({ userId, questionId })
        res.json({
            statusCode: conf.successCode,
            message: '取消收藏成功',
        })
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString()
        })
    }
}

// 获取收藏试题
exports.getCollectQuestion = async (req, res) => {
    try {
        const { userId, pageSize = 10, currentPage = 1, title, userName, beginTime, endTime, checkList, questionType } = req.query
        const { collectionList, total } = await questionDao.getCollectQuestion({ userId, pageSize, currentPage, title, userName, beginTime, endTime, checkList, questionType })
        res.json({
            statusCode: conf.successCode,
            message: '查询成功',
            data: {
                collectionList,
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

// 获取试题库
exports.getItemBank = async (req, res) => {
    try {
        const { checkList,userId, pageSize = 10, currentPage = 1, title, beginTime, endTime, questionType } = req.query
        const { itemList, total } = await questionDao.getItemBank({ checkList,userId, pageSize, currentPage, title, beginTime, endTime, questionType })
        res.json({
            statusCode: conf.successCode,
            message: '查询成功',
            data: {
                itemList,
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


// 添加试题库
exports.addItemBank = async (req, res) => {
    try {
        const { checkList,userId, single, multiple, judgement, answer, questionType } = req.body
        const result = await questionDao.addItemBank({ checkList,userId, single, multiple, judgement, answer, questionType })
        res.json({
            statusCode: conf.successCode,
            message: '添加成功',
        })
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString()
        })
    }
}

// 生成练习题
exports.createExercises = async (req, res) => {
    try {
        const { checkList,userId, singleCount, multipleCount, judgementCount, answerCount, questionType } = req.query
        const result = await questionDao.createExercises({ checkList,userId, singleCount, multipleCount, judgementCount, answerCount, questionType })
        res.json({
            statusCode: conf.successCode,
            message: '添加成功',
            data: {
                exercises: result
            }
        })
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString()
        })
    }
}


// 删除试题
exports.deleteBank = async (req, res) => {
    try {
        const { id } = req.query
        const result = await questionDao.deleteBank({ id })
        res.json({
            statusCode: conf.successCode,
            message: '添加成功',
        })
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString()
        })
    }
}

// 删除试题
exports.editBank = async (req, res) => {
    try {
        const { question } = req.body
        const result = await questionDao.editBank({ question })
        res.json({
            statusCode: conf.successCode,
            message: '修改成功',
        })
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString()
        })
    }
}


// 删除错题
exports.deleteMistake = async (req, res) => {
    try {
        const { id } = req.query
        const result = await questionDao.deleteMistake({ id })
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

