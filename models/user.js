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
        type:Number,
        // 0普通用户,1管理员
        default:0
    },
    jurisdiction:{
        type:Array,
        default:function(){
            return ['1','1-1','1-2','1-3','1-4','2']
        }
    }
})

module.exports = User = mongoose.model('users',user)