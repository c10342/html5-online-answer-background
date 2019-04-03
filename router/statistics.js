const express = require('express')

const router = express.Router()

const statistics = require('../server/statistics')

// 统计试题
router.get('/statisticsQuestions',statistics.statisticsQuestions)

// 根据试题id统计试题
router.get('/statisticsQuestionsById/:id',statistics.statisticsQuestionsById)

// 根据试题id获取答题人的信息
router.get('/getAnswerUserById/:id',statistics.getAnswerUserById)


module.exports = router