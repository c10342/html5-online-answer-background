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
        port: '6379',
        host: '127.0.0.1'
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
    whiteList: ['/user/login', '/user/register', '/user/sendCode', '/user/logout'],
}