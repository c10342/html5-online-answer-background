const mongoose = require('mongoose')

const Schema = mongoose.Schema

const comment = new Schema({
    // 评论者用户名
    userName:{
        type:String,
        required:true
    },
    questionId:{
        type:String,
        required:true,
    },
    userId:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true
    },
    createTime:{
        type:Date,
        default:Date.now
    },
    title:{
        type:String,
        required:true
    }
})

module.exports = Comments = mongoose.model('comments',comment)