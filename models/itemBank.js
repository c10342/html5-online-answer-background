const moogose = require('mongoose')

const Schema = moogose.Schema

const itemBanks = new Schema({
    questionType: {
        required: true,
        type: String
    },
    createTime: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true
    },
    question: {
        type: Object,
        required: true
    },
    type:{
        type:Number,
        required:true
    },
    userId:{
        type:String,
        required:true
    }
})

module.exports = ItemBanks = moogose.model('itemBanks',itemBanks)