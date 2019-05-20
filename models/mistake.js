const mongoose = require('mongoose')

const Schema = mongoose.Schema

const mistakes = new Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    types: {
        //0单选，1多选，2判断，3简答
        type: Number,
        required: true
    },
    question: {
        type: Object,
        required: true
    },
    createTime: {
        type: Date,
        default: Date.now
    },
    count: {
        type: Number,
        default: 1
    },
    questionId: {
        type: String,
        required: true
    }

})

module.exports = Mistakes = mongoose.model('mistakes', mistakes)