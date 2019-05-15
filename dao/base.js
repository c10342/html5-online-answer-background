class Base {
    /**
     * 模糊查询参数
     * 
     * @param {any} { title, beginTime, endTime, userName,content } 
     * @returns 
     * @memberof Base
     */
    getParams({email, title, beginTime, endTime, userName, content,name,checkList,questionType }) {
        let params = {}
        if (title) {
            // 模糊查询
            params.title = new RegExp(title)
        }
        if (userName) {
            params.userName = new RegExp(userName)
        }
        if (content) {
            params.content = new RegExp(content)
        }
        if(email){
            params.email = new RegExp(email)
        }
        if(name){
            params.name = new RegExp(name)
        }
        if(checkList){
            params.checkList = new RegExp(checkList)
        }
        if(questionType){
            params.questionType = new RegExp(questionType)
        }
        if (beginTime) {
            if (params.createTime) {
                params.createTime["$gte"] = beginTime
            } else {
                params.createTime = { "$gte": beginTime }
            }
        }
        if (endTime) {
            endTime = new Date(endTime)
            endTime.setDate(endTime.getDate() + 1)
            if (params.createTime) {
                params.createTime["$lte"] = endTime
            } else {
                params.createTime = { "$lte": endTime }
            }
        }
        return params
    }

    /**
     * 根据用户的答卷统计试题
     * 
     * @memberof Base
     */
    statisticsQuestion({ result }) {
        try {
            let data = []
            result.forEach(item => {
                // 单选题
                let single = item.questionId.single
                let singleQuestion = single.question
                let singleCorrect = 0
                singleQuestion.forEach(q => {
                    if (item.answer[q.id] && item.answer[q.id] == single.answer[q.id]) {
                        singleCorrect += 1
                    }
                })

                // 多选题
                let multiple = item.questionId.multiple
                let multipleQuestion = multiple.question
                let multipleCorrect = 0
                multipleQuestion.forEach(q => {
                    if (item.answer[q.id] && item.answer[q.id].sort().toString() == multiple.answer[q.id]) {
                        multipleCorrect += 1
                    }
                })

                // 判断题
                let judgement = item.questionId.judgement
                let judgementQuestion = judgement.question
                let judgementCorrect = 0
                judgementQuestion.forEach(q => {
                    if (item.answer[q.id] && item.answer[q.id] == judgement.answer[q.id]) {
                        judgementCorrect += 1
                    }
                })

                // 简答题
                let answer = item.questionId.answer
                let answerQuestion = answer.question
                let answerCorrect = 0
                answerQuestion.forEach(q => {
                    if (item.answer[q.id] && this.util.strSimilarity2Percent(item.answer[q.id], answer.answer[q.id]) > 0.5) {
                        answerCorrect += 1
                    }
                })
                let correctCount = singleCorrect + multipleCorrect + judgementCorrect + answerCorrect
                let totalCount = item.questionId.single.count + item.questionId.multiple.count + item.questionId.judgement.count + item.questionId.answer.count
                let obj = {
                    title: item.questionId.title,
                    single: {
                        singleCorrect,
                        singleCount: item.questionId.single.count
                    },
                    multiple: {
                        multipleCorrect,
                        multipleCount: item.questionId.multiple.count
                    },
                    judgement: {
                        judgementCorrect,
                        judgementCount: item.questionId.judgement.count
                    },
                    answer: {
                        answerCorrect,
                        answerCount: item.questionId.answer.count
                    },
                    answerId: item._id,
                    userName: item.userName,
                    createTime: item.createTime,
                    questionId: item.questionId._id,
                    correctCount,
                    totalCount,
                    correctPercent: correctCount / totalCount,
                    answerTime:item.answerTime
                }
                data.push(obj)
            })
            return data
        } catch (error) {
            throw error.toString()
        }
    }
}

module.exports = Base