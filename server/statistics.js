const conf = require('../config/index')

const StatisticsDao = require('../dao/statistics')

const statisticsDao = new StatisticsDao()

// 统计用户发布的所有试题
exports.statisticsQuestions = async (req, res) => {
    try {
        const { userId, pageSize = 10, currentPage = 1, title, endTime, beginTime } = req.query
        const { list, total } = await statisticsDao.statisticsQuestions({ userId, pageSize, currentPage, title, endTime, beginTime })
        res.json({
            statusCode: conf.successCode,
            data: {
                list,
                total
            },
            message: '查询成功'
        })
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString()
        })
    }
}

// 根据试题id统计试题
exports.statisticsQuestionsById = async (req, res) => {
    try {
        const { id } = req.params
        const { list } = await statisticsDao.statisticsQuestionsById({ id })
        res.json({
            statusCode: conf.successCode,
            data: {
                list
            },
            message: '统计成功'
        })
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString()
        })
    }
}

// 根据试题id获取答题人的信息
exports.getAnswerUserById = async (req, res) => {
    try {
        const { id } = req.params
        const { userName, beginTime, endTime, pageSize = 10, currentPage = 1 } = req.query
        const { answerList, total } = await statisticsDao.getAnswerUserById({ id, userName, beginTime, endTime, pageSize, currentPage })
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