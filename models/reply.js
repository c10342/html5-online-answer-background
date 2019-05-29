const mongoose = require('mongoose')

const Schema = mongoose.Schema

const reply = new Schema({
    // 恢复用户名
    userName:{
        type:String,
        required:true
    },
    commentId:{
        type:String,
        required:true,
    },
    userId:{
        type:String,
        required:true,
    },
    replyId:{
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
    }
})

module.exports = Reply = mongoose.model('replys',reply)