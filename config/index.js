module.exports = {
    // 数据库链接地址
    get mongodbURI() {
        return 'mongodb://localhost:27017/anwser'
    },
    // smtp邮箱服务
    auth: {
        // 邮箱
        get user() {
            return 'p6699148@163.com'
        },
        // 授权码
        get pass() {
            return 'lin19960519'
        }
    },
    // redis配置
    redisConf: {
        get port(){
            return '6379'
        },
        get host(){
            return '127.0.0.1'
        }
    },
    // 成功返回码
    get successCode() {
        return 200;
    },
    // 失败返回码
    get errorCode() {
        return 400;
    },

    // session配置
    sessionConf: {
        // session名称
        get sessionName() {
            return 'session_id'
        },

        // session过期时间
        get maxAge() {
            return 1000 * 60 * 60 * 24
        },
    },

    jwtConfig: {
        // jwt加密
        get privateKey() {
            return 'jwt-key';
        },

        // token过期时间
        get tokenTime() {
            return '1h'
        },
    },

    // 白名单
    get whiteList(){
        return [
            '/user/login', 
            '/user/register', 
            '/user/sendCode', 
            '/user/logout',
            '/user/getGithubInfo',
            '/downLoad/downLoadTemplate',
            '/questions/submitQuestion',
            '/questions/getQuestionById'
        ]
    },

    githubConf:{
        get clientID(){
            return 'a82354ff0df1d871f371'
        },
        get clientSecret(){
            return '461bfeb730df4444779cf0b2e50e5238fe87ad59'
        },
        get access_token_url(){
            return 'https://github.com/login/oauth/access_token'
        },
        get redirect_uri(){
            // return 'http://120.79.209.208:9092'
            return 'https://c10342.mynatapp.cc'
        },
        get user_info_url(){
            return 'https://api.github.com/user?'
        }
    },

    baiduApi:{
        get APIKey(){
            return 'qPIrRkVYPWUPhMZkH8YTydSa'
        },
        get SecretKey(){
            return 'NyvOqeTvaZVIgGyVoep2NpgZ5AAKN6Bo'
        },
        get url(){
            return 'https://aip.baidubce.com/oauth/2.0/token'
        },
        get requestUrl(){
            return 'https://aip.baidubce.com/rest/2.0/antispam/v2/spam'
        }
    }
}