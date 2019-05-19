const mongoose = require('mongoose')

const Schema = mongoose.Schema

const questions = new Schema({
    // 试题名称
    title:{
        type:String,
        required:true
    },
    // 发布者用户名
    userName:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    single:{
        type:Object,
        required:true
    },
    multiple:{
        type:Object,
        required:true
    },
    judgement:{
        type:Object,
        required:true
    },
    answer:{
        type:Object,
        required:true
    },
    createTime:{
        type:Date,
        default:Date.now
    },
    checkList:{
        required:true,
        type:String,
    },
    questionType:{
        required:true,
        type:String
    },
    isExercises:{
        type:Number,
        default:0  //1是测试题
    }
})

module.exports = Questions = mongoose.model('questions',questions)