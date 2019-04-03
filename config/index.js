module.exports = {
    // 数据库链接地址
    mongodbURI: 'mongodb://localhost:27017/anwser',
    auth: {
        // 邮箱
        user: 'p6699148@163.com',
        // 授权码
        pass: 'lin19960519'
    },
    redisConf: {
        port: '6379',
        host: '127.0.0.1'
    },
    // 成功返回码
    successCode: 200,
    // 失败返回码
    errorCode: 400,

    sessionName:'session_id'
}