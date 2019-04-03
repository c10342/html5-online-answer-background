const mongoose = require('mongoose')

const Schema = mongoose.Schema

const user = new Schema({
    name:{
        required:true,
        type:String
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