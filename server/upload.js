const conf = require('../config/index')

const UploadDao = require('../dao/upload')

const uploadDao = new UploadDao()

exports.uploadFile = (req, res) => {
    try {
        let excelFile = req.files.file.data;

        const { data, message } = uploadDao.handelData(excelFile)

        res.json({
            statusCode: conf.successCode,
            data,
            message
        })
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString()
        })
    }
}