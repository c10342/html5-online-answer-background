const mongoose = require('mongoose')

const {getCode} = require('../util/index')

const Schema = mongoose.Schema

const user = new Schema({
    name:{
        required:true,
        type:String
    },
    githubId:{
        type:Number,
        default:getCode(1000,100000)
    },
    email:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    },
    createTime:{
        type:Date,
        default:Date.now
    },
    identity:{
        type:String,
        // 0管理员，1小学生，2初中生，3高中生，4大学生，5教师，6游客，7其他
        required:true
    },
    jurisdiction:{
        type:Array,
        default:function(){
            return ['1','1-1','1-2','1-3','1-4','2','3']
        }
    }
})

module.exports = User = mongoose.model('users',user)