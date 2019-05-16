const mongoose = require('mongoose')

const Schema = mongoose.Schema

const collection = new Schema({
    userId:{
        type:String,
        required:true
    },
    questionId:{
        type:Array,
        default:function(){
            return []
        }
    }
})

module.exports = Collections = mongoose.model('collections',collection)