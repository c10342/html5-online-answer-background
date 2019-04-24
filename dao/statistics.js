const Base = require('./base')

const Questions = require('../models/questions')

const Answers = require('../models/answer')

const util = require('../util/index')

class StatisticsDao extends Base {
    constructor() {
        super()
        this.Questions = Questions
        this.util = util
        this.Answers = Answers
    }

    /**
     * 根据用户id统计用户发布的所有试题
     * 
     * @param {any} { userId ,title,endTime,beginTime} 
     * @returns 
     * @memberof StatisticsDao
     */
    async statisticsQuestions({ userId, pageSize = 10, currentPage = 1, title, endTime, beginTime }) {
        try {
            let params = {
                userId,
                ...this.getParams({
                    title,
                    endTime,
                    beginTime
                })
            }
            let qResult = await this.Questions.find(params)
                .skip(pageSize * (currentPage - 1))
                .limit(parseInt(pageSize))
                .sort({
                    '_id': -1
                })
            let total = await this.Questions.countDocuments(params)
            let arr = []
            let len = qResult.length
            for (let j = 0; j < len; j++) {
                let item = qResult[j]
                let id = item._id
                let count = 0
                let aResult = await this.Answers.find({
                    questionId: id
                })

                // 统计单选题
                item.single.question.forEach(single => {
                    let val = single.answer
                    let key = single.id
                    aResult.forEach(i => {
                        if (i.answer[key] && i.answer[key] == val) {
                            count += 1
                        }
                    })
                })

                // 统计判断题
                item.judgement.question.forEach(judgement => {
                    let val = judgement.answer
                    let key = judgement.id
                    aResult.forEach(i => {
                        if (i.answer[key] && i.answer[key] == val) {
                            count += 1
                        }
                    })
                })

                // 统计多选题
                item.multiple.question.forEach(multiple => {
                    let val = multiple.answer
                    let key = multiple.id
                    aResult.forEach(i => {
                        if (i.answer[key] && i.answer[key].sort().toString() == val.sort().toString()) {
                            count += 1
                        }
                    })
                })

                // 统计简答题
                item.answer.question.forEach(answer => {
                    let val = answer.answer
                    let key = answer.id
                    aResult.forEach(i => {
                        if (i.answer[key] && this.util.strSimilarity2Percent(i.answer[key], val) > 0.5) {
                            count += 1
                        }
                    })
                })
                let totalQuestion = item.single.count + item.multiple.count + item.judgement.count + item.answer.count
                arr.push({
                    title: item.title,
                    answerCount: aResult.length,
                    userId: item.userId,
                    createTime: item.createTime,
                    questionId: item._id,
                    percent: count / (totalQuestion * aResult.length),
                })
            }
            return {list: arr,total}
        } catch (error) {
            throw error.toString()
        }
    }

    /**
     * 根据试题id统计试题
     * 
     * @param {any} { id } 
     * @returns 
     * @memberof StatisticsDao
     */
    async statisticsQuestionsById({ id }) {
        try {
            let qResult = await this.Questions.findById(id)
            if (qResult) {
                let aResult = await this.Answers.find({
                    questionId: qResult._id
                })

                let singleArr = []
                // 统计单选题
                qResult.single.question.forEach(single => {
                    let val = single.answer
                    let key = single.id
                    let count = 0
                    let A = 0
                    let B = 0
                    let C = 0
                    let D = 0
                    let other = 0
                    let totalNum = 0
                    aResult.forEach(i => {
                        let mot = i.answer[key]
                        if (mot) {
                            totalNum += 1
                            if (mot == val) {
                                count += 1
                            }
                            switch (mot) {
                                case 'A':
                                    A += 1;
                                    break;
                                case 'B':
                                    B += 1;
                                    break;
                                case 'C':
                                    C += 1;
                                    break;
                                case 'D':
                                    D += 1;
                                    break;
                            }
                        } else {
                            other += 1
                        }
                    })
                    singleArr.push({
                        title: single.title,
                        correctCount: count,
                        correctAnswer: val,
                        totalNum,
                        A, B, C, D, other,
                        unAnswer: aResult.length - totalNum
                    })
                })

                let judgementArr = []
                // 统计判断题
                qResult.judgement.question.forEach(judgement => {
                    let val = judgement.answer
                    let key = judgement.id
                    let count = 0
                    let A = 0
                    let B = 0
                    let other = 0
                    let totalNum = 0
                    aResult.forEach(i => {
                        let mot = i.answer[key]
                        if (mot) {
                            totalNum += 1
                            if (mot == val) {
                                count += 1
                            }
                            switch (mot) {
                                case 'A':
                                    A += 1;
                                    break;
                                case 'B':
                                    B += 1;
                                    break;
                            }
                        } else {
                            other += 1
                        }
                    })
                    judgementArr.push({
                        title: judgement.title,
                        correctCount: count,
                        correctAnswer: val,
                        totalNum,
                        A, B, other,
                        unAnswer: aResult.length - totalNum
                    })
                })

                let multipleArr = []
                // 统计多选题
                qResult.multiple.question.forEach(multiple => {
                    let val = multiple.answer
                    let key = multiple.id
                    let count = 0
                    let A = 0
                    let B = 0
                    let C = 0
                    let D = 0
                    let other = 0
                    let totalNum = 0
                    aResult.forEach(i => {
                        let mot = i.answer[key]
                        if (mot) {
                            mot = mot.sort().toString()
                            totalNum += 1
                            if (mot == val.sort().toString()) {
                                count += 1
                            }
                            if (mot.includes('A')) {
                                A += 1
                            }
                            if (mot.includes('B')) {
                                B += 1
                            }
                            if (mot.includes('C')) {
                                C += 1
                            }
                            if (mot.includes('D')) {
                                D += 1
                            }
                        } else {
                            other += 1
                        }
                    })
                    multipleArr.push({
                        title: multiple.title,
                        correctCount: count,
                        correctAnswer: val.sort().toString(),
                        totalNum,
                        A, B, C, D, other,
                        unAnswer: aResult.length - totalNum
                    })
                })

                let answerArr = []
                // 统计简答题
                qResult.answer.question.forEach(answer => {
                    let val = answer.answer
                    let key = answer.id
                    let count = 0
                    let totalNum = 0
                    let other = 0
                    aResult.forEach(i => {
                        let mot = i.answer[key]
                        if (mot) {
                            totalNum += 1
                            if (this.util.strSimilarity2Percent(mot, val) > 0.5) {
                                count += 1
                            }
                        } else {
                            other += 1
                        }
                    })
                    answerArr.push({
                        title: answer.title,
                        correctCount: count,
                        correctAnswer: val,
                        totalNum,
                        other,
                        unAnswer: aResult.length - totalNum
                    })
                })

                let obj = {
                    single: singleArr,
                    multiple: multipleArr,
                    judgement: judgementArr,
                    answer: answerArr
                }
                return {list: obj}
            } else {
                throw '统计失败,无此试题'
            }
        } catch (error) {
           throw error.toString()
        }
    }

    /**
     * 根据试卷id查询所有答题者信息
     * 
     * @param {any} { id,userName,beginTime,endTime } 
     * @returns 
     * @memberof StatisticsDao
     */
    async getAnswerUserById({ id, pageSize = 10, currentPage = 1, userName, beginTime, endTime }) {
        try {
            let params = {
                questionId: id,
                ...this.getParams({
                    userName,
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
                return {answerList: data,total}
            } else {
                throw '查询失败'
            }
        } catch (error) {
            throw error.toString()
        }
    }

}

module.exports = StatisticsDao