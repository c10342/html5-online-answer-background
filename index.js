const express = require('express')

const mongoose = require('mongoose')

const bodyParser = require('body-parser')

const session = require('express-session')

const redis = require('redis')

const app = express()

const {mongodbURI,redisConf,sessionName,errorCode} = require('./config')

const user = require('./router/user')

const questions = require('./router/questions')

const comment = require('./router/comment')

const upload = require('./router/upload')

const statistics = require('./router/statistics')

const downLoad = require('./router/downLoad')

const port = process.env.PORT || 5000

const host = process.env.HOST || 'localhost'

const RedisClient = redis.createClient(redisConf.port,redisConf.host)

const RedisStore = require('connect-redis')(session)

const FileUpload = require('express-fileupload')

const path = require('path')

const history = require('connect-history-api-fallback')

// 连接数据库
mongoose.connect(mongodbURI,{ useNewUrlParser: true })
.then(()=>{
    console.log('connect success')
})
.catch(error=>{
    console.log(error)
})

// 中间件
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// 使用redis持久化session
app.use(session({
    secret: 'keyboard cat',
    store:new RedisStore({
        client:RedisClient,
        //disableTTL:false ==> ReplyError: ERR wrong number of arguments for 'set' command
        disableTTL:true
    }),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false,maxAge: 1000*60*60*24 },
    name:sessionName
}));

app.use(FileUpload());

// 检查是否已经登录
app.use('/api',function(req,res,next){
    let url = req.url
    if(url.startsWith('/user/login') || url.startsWith('/user/register') || url.startsWith('/user/sendCode')){
        next()
    }else{
        if(req.session.login){
            next()
        }else{
            res.json({
                statusCode:errorCode,
                message:'登录已过期,请检查登录状态'
            })
        }
    }
})

// 路由
app.use('/api/user',user)
app.use('/api/questions',questions)
app.use('/api/comment',comment)
app.use('/api/upload',upload)
app.use('/api/statistics',statistics)
app.use('/api/downLoad',downLoad)

// 配合使用前端history模式
app.use(history())

app.use('/',express.static(path.join(__dirname,'./dist')))

app.listen(port,host,()=>{
    console.log(`${host}:${port}`)
})