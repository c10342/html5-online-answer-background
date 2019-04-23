const express = require('express')

const mongoose = require('mongoose')

const bodyParser = require('body-parser')

const session = require('express-session')

const redis = require('redis')

const app = express()

const {
    mongodbURI,
    redisConf,
    sessionConf,
    errorCode,
    whiteList,
    jwtConfig
} = require('./config')

const util = require('./util/index')

const user = require('./router/user')

const questions = require('./router/questions')

const comment = require('./router/comment')

const upload = require('./router/upload')

const statistics = require('./router/statistics')

const downLoad = require('./router/downLoad')

const RedisClient = redis.createClient(redisConf.port, redisConf.host)

const RedisStore = require('connect-redis')(session)

const FileUpload = require('express-fileupload')

const path = require('path')

const history = require('connect-history-api-fallback')

const jwt = require('jsonwebtoken')

// 请求日志插件
const logger = require('morgan')
// 用于分割日志
const FileStreamRotator = require('file-stream-rotator')

const fs = require('fs')

// 连接数据库
mongoose.connect(mongodbURI, {
        useNewUrlParser: true
    })
    .then(() => {
        console.log('connect success')
    })
    .catch(error => {
        console.log(error)
    })

// 请求日志相关
const logDirectory = path.join(__dirname, './log')
// 判断log目录是否存在，不存在就创建
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
// create a rotating write stream,分割日志
const accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: path.join(logDirectory, 'access-%DATE%.log'),
    frequency: 'daily',
    verbose: false
})
app.use(logger('dev', {
    skip: function (req, res) {
        // 状态码小于400的日志不会打印在控制台，即出现错误才会打印在控制台
        return res.statusCode < 400
    },
}));
// 把请求日志写入文件
app.use(logger('common', {
    stream: accessLogStream
}))

// 处理post请求数据
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

// 使用redis持久化session
app.use(session({
    secret: 'keyboard cat',
    store: new RedisStore({
        client: RedisClient,
        //disableTTL:false ==> ReplyError: ERR wrong number of arguments for 'set' command
        disableTTL: true
    }),
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: sessionConf.maxAge
    },
    name: sessionConf.sessionName
}));

// 把上传的文件保存在内存中
app.use(FileUpload());

// 检查是否已经登录,以及校验token
app.use('/api', function (req, res, next) {
    try {
        let url = req.url
        let flag = whiteList.some(item => url.startsWith(item))
        if (flag) {
            next()
        } else {
            let token = req.headers.token
            // 校验token
            jwt.verify(token, jwtConfig.privateKey, function (err, decoded) {
                if (err) {
                    res.json({
                        statusCode: 401,
                        message: 'token已经过期或无效'
                    })
                    return
                }
                if (req.session.login && decoded._id) {
                    // 刷新token
                    res.setHeader('token',util.createToken(decoded,jwtConfig.privateKey,{ expiresIn: jwtConfig.tokenTime }))
                    next()
                } else {
                    res.json({
                        statusCode: 401,
                        message: '登录已过期,请重新登录'
                    })
                }
            });
        }
    } catch (error) {
        res.json({
            statusCode: errorCode,
            message: error.toString()
        })
    }
})

// 路由
app.use('/api/user', user)
app.use('/api/questions', questions)
app.use('/api/comment', comment)
app.use('/api/upload', upload)
app.use('/api/statistics', statistics)
app.use('/api/downLoad', downLoad)

// 配合使用前端history模式
app.use(history())

// 静态资源
app.use('/', express.static(path.join(__dirname, './dist')))

// 处理全局错误
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.json({
        statusCode: errorCode,
        message: err.stack.toString()
    })
})

const port = process.env.PORT || 5000

const host = process.env.HOST || 'localhost'

app.listen(port, host, () => {
    console.log(`服务器地址 : ${host}:${port}`)
})