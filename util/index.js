const crypto = require('crypto')

const axios = require('axios')

const jwt = require('jsonwebtoken')

// md5加密
exports.cryptoPwd = (password) => {
    const md5 = crypto.createHash('md5')
    return md5.update(password).digest('hex')
}

function strSimilarity2Number(s, t) {
    var n = s.length, m = t.length, d = [];
    var i, j, s_i, t_j, cost;
    if (n == 0) return m;
    if (m == 0) return n;
    for (i = 0; i <= n; i++) {
        d[i] = [];
        d[i][0] = i;
    }
    for (j = 0; j <= m; j++) {
        d[0][j] = j;
    }
    for (i = 1; i <= n; i++) {
        s_i = s.charAt(i - 1);
        for (j = 1; j <= m; j++) {
            t_j = t.charAt(j - 1);
            if (s_i == t_j) {
                cost = 0;
            } else {
                cost = 1;
            }
            d[i][j] = Minimum(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        }
    }
    return d[n][m];
}

function Minimum(a, b, c) {
    return a < b ? (a < c ? a : c) : (b < c ? b : c);
}

// 对比2个字符串的相似度
exports.strSimilarity2Percent = (s, t) => {
    var l = s.length > t.length ? s.length : t.length;
    var d = strSimilarity2Number(s, t);
    return (1 - d / l).toFixed(4);
}

// get请求
exports.get = (url, params = {}, headers = {}) => {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params,
            headers
        }).then(res => {
            if (res.status == 200) {
                resolve(res.data)
            } else {
                reject(res.data)
            }
        }).catch(err => {
            reject(err)
        })
    })
}

// post请求
exports.post = (url, params = {}, config = {}) => {
    return new Promise((resolve, reject) => {
        axios.post(url, params, config).then(res => {
            if (res.status == 200) {
                resolve(res.data)
            } else {
                reject(res.data)
            }
        }).catch(err => {
            reject(err)
        })
    })
}

// 产生4位随机数
exports.getCode = (min = 1000, max = 10000) => {
    let code = Math.floor(Math.random() * (max - min + 1) + min)
    return code
}

// 产生随机字符串
exports.getRandomStr = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 6)
}

// 生成token
exports.createToken = (info, key, opt) => {
    return jwt.sign({ _id: info._id, name: info.name, email: info.email, createTime: info.createTime, password: info.password }, key, opt)
}

// 在min和max之间的数中取一个随机数
function getRandomInt(min, max) {
    // max-min+1是为了能去到上限max，0<Math.random<1
    return Math.floor(Math.random() * (max - min + 1) + min);
}


// 打乱数组
exports.shuffle = (arr) => {
    // 复制一个新数组
    var _arr = arr.slice()
    for (var i = 0; i < _arr.length; i++) {
        var j = getRandomInt(0, i);
        var t = _arr[i];
        _arr[i] = _arr[j];
        _arr[j] = t;
    }
    return _arr;
}