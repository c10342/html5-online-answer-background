const mongoose = require('mongoose')

const Schema = mongoose.Schema

const answer = new Schema({
    questionId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'questions'
    },//这里即为子表的外键，关联主表。  ref后的questions代表的是主表questions的Model。,
    // 答题者用户名
    userName:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    answer:{
        type:Object,
    },
    isComment:{
        type:Boolean,
        default:false
    },
    answerTime:{
        type:String,
        required:true
    },
    createTime:{
        type:Date,
        default:Date.now
    }
})

module.exports = Answers = mongoose.model('answers',answer)