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
    }
})

module.exports = User = mongoose.model('users',user)