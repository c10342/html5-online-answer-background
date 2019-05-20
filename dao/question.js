const Base = require('./base')

const Questions = require('../models/questions')

const User = require('../models/user')

const Answers = require('../models/answer')

const Comments = require('../models/comment')

const util = require('../util/index')

const Mistakes = require('../models/mistake')

const Collections = require('../models/collection')

const ItemBank = require('../models/itemBank')

class QusetionDao extends Base {
    constructor() {
        super()
        this.Questions = Questions
        this.User = User
        this.Comments = Comments
        this.util = util
        this.Answers = Answers
        this.Mistakes = Mistakes
        this.Collections = Collections
        this.ItemBank = ItemBank
    }

    /**
     * 添加试卷
     * 
     * @param {any} { title, userName, userId, single, multiple, judgement, answer } 
     * @returns 
     * @memberof QusetionDao
     */
    async addQuestion({ title, userName, userId, single, multiple, judgement, answer, checkList, questionType, flag }) {
        try {
            let obj = {
                title,
                userName,
                userId,
                single,
                multiple,
                judgement,
                answer,
                checkList,
                questionType,
                isExercises:flag=='2'?1:0
            }
            if (!flag || flag == '1') {
                let str = JSON.stringify(obj)
                const checked = await this.checkText(str, userId)
                if (checked.spam != 0) {
                    throw `您发表的内容包含 ${checked.message} 信息,不能发布`
                }
            }
            if (!flag) {
                // 添加单选题到试题库
                let s = single.question
                let ss = []
                s.forEach(item => {
                    ss.push({
                        questionType,
                        title: item.title,
                        question: item,
                        userId,
                        type: 0,
                        checkList
                    })
                })
                // 添加多选题到试题库
                let m = multiple.question
                m.forEach(item => {
                    ss.push({
                        questionType,
                        title: item.title,
                        question: item,
                        userId,
                        type: 1,
                        checkList
                    })
                })
                let j = judgement.question
                j.forEach(item => {
                    ss.push({
                        questionType,
                        title: item.title,
                        question: item,
                        userId,
                        type: 2,
                        checkList
                    })
                })
                let q = answer.question
                q.forEach(item => {
                    ss.push({
                        questionType,
                        title: item.title,
                        question: item,
                        userId,
                        type: 3,
                        checkList
                    })
                })
                await this.ItemBank.insertMany(ss)
            }
            const question = new this.Questions(obj)
            const userRes = await this.User.findById(userId)
            if (userRes) {
                const result = await question.save()
                return result
            } else {
                throw '用户不存在,请检查登录状态'
            }
        } catch (error) {
            throw error.toString()
        }
    }

    /**
     * 查询所有试卷
     * 
     * @param {any} { _id, pageSize = 10, currentPage = 1, title, userName, beginTime, endTime } 
     * @returns 
     * @memberof QusetionDao
     */
    async getQuestion({ _id, pageSize = 10, currentPage = 1, title, userName, beginTime, endTime, checkList, questionType }) {
        try {
            let params = this.getParams({
                title,
                userName,
                beginTime,
                endTime,
                checkList,
                questionType
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

            const collection = await this.Collections.findOne({ userId: _id })
            let arr = []
            result.forEach((item) => {
                let totalCount = item.single.count + item.multiple.count + item.judgement.count + item.answer.count
                let isAnswer = answerRes.findIndex(i => i.questionId == item._id.toString()) > -1 ? true : false
                let isCollection = collection ? collection.questionId.includes(item._id.toString()) : false
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
                    totalCount,
                    questionType: item.questionType,
                    isCollection
                })
            })
            return { questionList: arr, total: count }
        } catch (error) {
            throw error.toString()
        }
    }

    /**
     * 根据试卷id查询试卷详情
     * 
     * @param {any} { id } 
     * @returns 
     * @memberof QusetionDao
     */
    async getQuestionById({ id }) {
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
                    questionType: result.questionType
                }
                return { questionList: obj }
            } else {
                throw '查询失败,没有此试卷'
            }
        } catch (error) {
            throw error.toString()
        }
    }

    /**
     * 根据用户id查询用户所发布的所有试卷
     * 
     * @param {any} { userId, pageSize = 10, currentPage = 1, title, beginTime, endTime } 
     * @returns 
     * @memberof QusetionDao
     */
    async getPublishedQuestion({ questionType, userId, pageSize = 10, currentPage = 1, title, beginTime, endTime }) {
        try {
            let params = {
                userId,
                ...this.getParams({
                    title,
                    beginTime,
                    endTime,
                    questionType
                }),
                isExercises:0
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
                    totalCount,
                    questionType: item.questionType
                })
            })
            return { publishedQuestion: arr, total: count }
        } catch (error) {
            throw error.toString()
        }
    }

    /**
     * 根据试卷id获取试卷详细信息
     * 
     * @param {any} { id } 
     * @returns 
     * @memberof QusetionDao
     */
    async getPublishedQuestionById({ id }) {
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
                obj.checkList = result.checkList
                obj.questionType = result.questionType
                return { questionDetail: obj }
            } else {
                throw '查询失败,没有此试卷'
            }

        } catch (error) {
            throw error.toString()
        }
    }

    /**
     * 保存用户做题的答案
     * 
     * @param {any} { userName, userId,answer, questionId,title } 
     * @returns 
     * @memberof QusetionDao
     */
    async submitQuestion({ userName, userId, answer, questionId, title, answerTime, questionType, singles, multiples, judgements, answers, flag }) {
        try {
            let r = null
            if (flag == '2') {
                r = await this.addQuestion({ title, userName, userId, single: singles, multiple: multiples, judgement: judgements, answer: answers, checkList: JSON.stringify([]), questionType, flag })
            }
            const myAnswer = new this.Answers({
                userName,
                userId,
                answer,
                questionId: questionId ? questionId : r._id,
                title,
                answerTime,
                questionType
            })
            const result = await myAnswer.save()

            //子表关联主表查询，populate里面为子表外键
            const item = await this.Answers.findById({
                _id: result._id
            }).populate('questionId')
            // 单选题
            let single = item.questionId.single
            if (single) {
                let singleQuestion = single.question
                singleQuestion.forEach(async q => {
                    if (!(item.answer[q.id] && item.answer[q.id] == single.answer[q.id])) {
                        q.message = q.answer
                        q.answer = item.answer[q.id] ? item.answer[q.id] : ''
                        let h = await this.Mistakes.findOne({questionId:q.id})
                        if(h){
                            await this.Mistakes.where({_id:h._id}).updateOne({
                                count:h.count+1,
                            })
                        }else{
                            let s = new this.Mistakes({
                                userId,
                                types: 0,
                                question: q,
                                title: q.title,
                                questionId:q.id
                            })
                            await s.save()
                        }
                    }
                })
            }

            // 多选题
            let multiple = item.questionId.multiple
            if (multiple) {
                let multipleQuestion = multiple.question
                multipleQuestion.forEach(async q => {
                    if (!(item.answer[q.id] && item.answer[q.id].sort().toString() == multiple.answer[q.id])) {
                        q.message = q.answer
                        q.answer = item.answer[q.id] ? item.answer[q.id] : []
                        let h = await this.Mistakes.findOne({questionId:q.id})
                        if(h){
                            await this.Mistakes.where({_id:h._id}).updateOne({
                                count:h.count+1
                            })
                        }else{
                            let s = new this.Mistakes({
                                userId,
                                types: 1,
                                question: q,
                                title: q.title,
                                questionId:q.id
                            })
                            await s.save()
                        }
                    }
                })
            }

            // 判断题
            let judgement = item.questionId.judgement
            if (judgement) {
                let judgementQuestion = judgement.question
                judgementQuestion.forEach(async q => {
                    if (!(item.answer[q.id] && item.answer[q.id] == judgement.answer[q.id])) {
                        q.message = q.answer == 'A' ? '对' : '错'
                        q.answer = item.answer[q.id] == 'A' ? '对' : '错'
                        let h = await this.Mistakes.findOne({questionId:q.id})
                        if(h){
                            await this.Mistakes.where({_id:h._id}).updateOne({
                                count:h.count+1,
                            })
                        }else{
                            let s = new this.Mistakes({
                                userId,
                                types: 2,
                                question: q,
                                title: q.title,
                                questionId:q.id
                            })
                            await s.save()
                        }
                    }
                })
            }
            // 简答题
            let answer1 = item.questionId.answer
            if (answer1) {
                let answerQuestion = answer1.question
                answerQuestion.forEach(async q => {
                    if (!(item.answer[q.id] && this.util.strSimilarity2Percent(item.answer[q.id], answer1.answer[q.id]) > 0.5)) {
                        q.message = q.answer
                        q.answer = item.answer[q.id] ? item.answer[q.id] : ''
                        let h = await this.Mistakes.findOne({questionId:q.id})
                        if(h){
                            await this.Mistakes.where({_id:h._id}).updateOne({
                                count:h.count+1
                            })
                        }else{
                            let s = new this.Mistakes({
                                userId,
                                types: 3,
                                question: q,
                                title: q.title,
                                questionId:q.id
                            })
                            await s.save()
                        }
                    }
                })
            }
            return result
        } catch (error) {
            throw error.toString()
        }
    }

    /**
     * 删除试卷
     * 
     * @param {any} { _id } 
     * @returns 
     * @memberof QusetionDao
     */
    async deleteQuestion({ _id }) {
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
            return '删除成功'
        } catch (error) {
            throw error.toString()
        }
    }

    /**
     * 根据试卷id编辑试卷
     * 
     * @param {any} { title, userName, userId, single, multiple, judgement, answer, _id } 
     * @returns 
     * @memberof QusetionDao
     */
    async editQuestion({ title, userName, userId, single, multiple, judgement, answer, _id, checkList, questionType }) {
        try {
            let obj = {
                title,
                userName,
                userId,
                single,
                multiple,
                judgement,
                answer,
                checkList,
                questionType
            }
            let str = JSON.stringify(obj)
            const checked = await this.checkText(str, userId)
            if (checked.spam != 0) {
                throw `您发表的内容包含 ${checked.message} 信息,不能发布`
            }
            const qResult = await this.Questions.where({
                _id
            }).updateOne(obj)
            const aResult = await this.Answers.where({
                questionId: _id
            }).updateMany({
                title,
                userName,
                userId
            })
            return aResult
        } catch (error) {
            throw error.toString()
        }
    }

    /**
     * 根据用户id获取用户所有已经作答的试卷
     * 
     * @param {any} { userId, pageSize = 10, currentPage = 1, title, beginTime, endTime } 
     * @returns 
     * @memberof QusetionDao
     */
    async getAnswerQuestion({ questionType, userId, pageSize = 10, currentPage = 1, title, beginTime, endTime }) {
        try {
            let params = {
                userId,
                ...this.getParams({
                    title,
                    beginTime,
                    endTime,
                    questionType
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
                return { answerList: data, total }
            } else {
                throw '查询失败'
            }
        } catch (error) {
            throw error.toString()
        }
    }

    /**
     * 根据答卷的id查询该答卷的详细信息
     * 
     * @param {any} { id } 
     * @returns 
     * @memberof QusetionDao
     */
    async getAnswerQuestionById({ id }) {
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
                return { answerDetail: obj }
            } else {
                throw '查询失败,没有此试卷'
            }
        } catch (error) {
            throw error.toString()
        }
    }

    /**
     *  查询错题
     * 
     * @param {any} {userId,types,currentPage=1,pageSize=10,beginTime,endTime,title} 
     * @memberof QusetionDao
     */
    async getMistake({ userId, types, currentPage = 1, pageSize = 10, beginTime, endTime, title }) {
        try {
            let params = {
                userId,
                types,
                ...this.getParams({
                    beginTime,
                    endTime,
                    title
                })
            }
            //子表关联主表查询，populate里面为子表外键
            const result = await this.Mistakes.find(params)
                .skip(pageSize * (currentPage - 1))
                .limit(parseInt(pageSize))
                .sort({
                    '_id': -1
                })
            const total = await this.Mistakes.countDocuments(params)
            return { mistakeList: result, total }
        } catch (error) {
            throw error.toString()
        }
    }

    /**
     *  收藏试题
     * 
     * @param {any} {userId,questionId} 
     * @returns 
     * @memberof QusetionDao
     */
    async collectQuestion({ userId, questionId }) {
        try {
            const collection = await this.Collections.findOne({ userId })
            if (collection) {
                let questionIdArr = collection.questionId
                questionIdArr.push(questionId)
                const result = await this.Collections.where({ userId }).updateOne({ questionId: questionIdArr })
                return result
            } else {
                let coll = new this.Collections({ userId, questionId: [questionId] })

                const r = coll.save()

                return r
            }
        } catch (error) {
            throw error.toString()
        }
    }

    /**
     * 取消收藏试题
     * 
     * @param {any} {userId,questionId} 
     * @returns 
     * @memberof QusetionDao
     */
    async cancelCollectQuestion({ userId, questionId }) {
        try {
            const collection = await this.Collections.findOne({ userId })
            let questionIdArr = collection.questionId
            const index = questionIdArr.findIndex(i => i == questionId)
            questionIdArr.splice(index, 1)
            const result = await this.Collections.where({ userId }).updateOne({ questionId: questionIdArr })
            return result
        } catch (error) {
            throw error.toString()
        }
    }

    /**
     * 获取收藏的试题
     * 
     * @param {any} { _id, pageSize = 10, currentPage = 1, title, userName, beginTime, endTime, checkList, questionType } 
     * @returns 
     * @memberof QusetionDao
     */
    async getCollectQuestion({ userId, pageSize = 10, currentPage = 1, title, userName, beginTime, endTime, checkList, questionType }) {
        try {
            let _id = userId
            let params = this.getParams({
                title,
                userName,
                beginTime,
                endTime,
                checkList,
                questionType
            })
            const collection = await this.Collections.findOne({ userId })
            if (!collection) {
                return { collectionList: [], total: 0 }
            }
            const answerRes = await this.Answers.find({
                userId: _id,
                questionId: { $in: collection.questionId }
            }).select('questionId')
            const count = await this.Questions.where({ _id: { $in: collection.questionId } }).countDocuments(params)
            const result = await this.Questions.where({ _id: { $in: collection.questionId } }).find(params)
                .skip(pageSize * (currentPage - 1))
                .limit(parseInt(pageSize))
                .sort({
                    '_id': -1
                })

            let arr = []
            result.forEach((item) => {
                let totalCount = item.single.count + item.multiple.count + item.judgement.count + item.answer.count
                let answerIndex = answerRes.findIndex(i => i.questionId == item._id.toString())
                let isAnswer = answerIndex > -1 ? true : false
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
                    totalCount,
                    questionType: item.questionType,
                    answerId: isAnswer ? answerRes[answerIndex]['_id'] : '-1'
                })
            })
            return { collectionList: arr, total: count }
        } catch (error) {
            throw error.toString()
        }
    }


    /**
     * 获取试题库
     *
     * @param {*} { userId, pageSize = 10, currentPage = 1, title, beginTime, endTime, questionType }
     * @returns
     * @memberof QusetionDao
     */
    async getItemBank({ checkList,userId, pageSize = 10, currentPage = 1, title, beginTime, endTime, questionType }) {
        try {
            let params = {
                ...this.getParams({
                    title,
                    beginTime,
                    endTime,
                    questionType,
                    checkList
                }),
                $or:[{userId},{checkList:new RegExp(checkList)}]
                // $group:{userId,checkList:new RegExp(checkList)},
                // userId:{$or:new RegExp(userId)}
            }
            const collection = await this.ItemBank.find(params)
                .skip(pageSize * (currentPage - 1))
                .limit(parseInt(pageSize))
                .sort({
                    '_id': -1
                })
            const count = await this.ItemBank.countDocuments(params)
            return { itemList: collection, total: count }
        } catch (error) {
            throw error.toString()
        }
    }

    /**
     * 添加试题库
     *
     * @param {*} { userId, single, multiple, judgement, answer,questionType}
     * @returns
     * @memberof QusetionDao
     */
    async addItemBank({ checkList,userId, single, multiple, judgement, answer, questionType }) {
        try {
            let obj = {
                userId,
                single,
                multiple,
                judgement,
                answer,
                questionType,
                checkList
            }
            let str = JSON.stringify(obj)
            const checked = await this.checkText(str, userId)
            if (checked.spam != 0) {
                throw `您发表的内容包含 ${checked.message} 信息,不能发布`
            }
            // 添加单选题到试题库
            let s = single.question
            let ss = []
            s.forEach(item => {
                ss.push({
                    questionType,
                    title: item.title,
                    question: item,
                    userId,
                    type: 0,checkList
                })
            })
            // 添加多选题到试题库
            let m = multiple.question
            m.forEach(item => {
                ss.push({
                    questionType,
                    title: item.title,
                    question: item,
                    userId,
                    type: 1,checkList
                })
            })
            let j = judgement.question
            j.forEach(item => {
                ss.push({
                    questionType,
                    title: item.title,
                    question: item,
                    userId,
                    type: 2,checkList
                })
            })
            let q = answer.question
            q.forEach(item => {
                ss.push({
                    questionType,
                    title: item.title,
                    question: item,
                    userId,
                    type: 3,checkList
                })
            })
            const result = await this.ItemBank.insertMany(ss)
            return result
        } catch (error) {
            throw error.toString()
        }
    }

    /**
     * 生成练习题
     *
     * @param {*} { userId, singleCount, multipleCount, judgementCount, answerCount, questionType }
     * @returns
     * @memberof QusetionDao
     */
    async createExercises({ userId, singleCount, multipleCount, judgementCount, answerCount, questionType }) {
        try {
            let params = { userId, questionType }
            let questions = await this.ItemBank.find(params)
            let result = this.handelExercises(questions, singleCount, multipleCount, judgementCount, answerCount)
            return result
        } catch (error) {
            throw error.toString()
        }
    }


    /**
     * 删除试题
     *
     * @param {*} { id }
     * @returns
     * @memberof QusetionDao
     */
    async deleteBank({ id }) {
        try {
            let result = await this.ItemBank.deleteOne({_id:id})
            return result
        } catch (error) {
            throw error.toString()
        }
    }

    /**
     * 编辑试题
     * 
     * @param {any} { question } 
     * @returns 
     * @memberof QusetionDao
     */
    async editBank({ question }) {
        try {
            let result = await this.ItemBank.where({_id:question._id}).updateOne(question)
            return result
        } catch (error) {
            throw error.toString()
        }
    }

    /**
     * 删除错题
     * 
     * @param {any} { id } 
     * @returns 
     * @memberof QusetionDao
     */
    async deleteMistake({ id }) {
        try {
            let result = await this.Mistakes.deleteOne({_id:id})
            return result
        } catch (error) {
            throw error.toString()
        }
    }

    /**
     * 处理练习题
     *
     * @param {*} questions
     * @param {*} singleCount
     * @param {*} multipleCount
     * @param {*} judgementCount
     * @param {*} answerCount
     * @returns
     * @memberof QusetionDao
     */
    handelExercises(questions, singleCount, multipleCount, judgementCount, answerCount) {
        let obj = {
            single: [],
            multiple: [],
            judgement: [],
            answer: []
        }
        questions.forEach(item => {
            let question = item.question
            let type = item.type
            if (type == 0) {
                obj.single.push(Object.assign({},question,{a:question.answer,answer:''}))
            } else if (type == 1) {
                obj.multiple.push(Object.assign({},question,{a:question.answer,answer:[]}))
            } else if (type == 2) {
                obj.judgement.push(Object.assign({},question,{a:question.answer,answer:''}))
            } else if (type == 3) {
                obj.answer.push(Object.assign({},question,{a:question.answer,answer:''}))
            }
        })
        if (obj.single.length > singleCount) {
            let s = this.util.shuffle(obj.single)
            obj.single = s.slice(0, singleCount)
        }
        if (obj.multiple.length > multipleCount) {
            let s = this.util.shuffle(obj.multiple)
            obj.multiple = s.slice(0, multipleCount)
        }
        if (obj.judgement.length > judgementCount) {
            let s = this.util.shuffle(obj.judgement)
            obj.judgement = s.slice(0, judgementCount)
        }
        if (obj.answer.length > answerCount) {
            let s = this.util.shuffle(obj.answer)
            obj.answer = s.slice(0, answerCount)
        }
        return obj
    }

}

module.exports = QusetionDao