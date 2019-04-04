const path = require('path')

const conf = require('../config/index')

exports.downLoadTemplate = (req,res) => {
    try {
        res.download(path.join(__dirname,'../files/试题模板.xls'))
    } catch (error) {
        res.json({
            statusCode:conf.errorCode,
            message:error.toString()
        })
    }
}