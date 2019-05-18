const redis = require('redis')

const {
    redisConf
} = require('../config')

const RedisClient = redis.createClient(redisConf.port, redisConf.host)

// redis 链接错误
RedisClient.on("error", function(error) {
    console.log(error);
});

RedisClient.on('connect',function(){
    console.log('redis connect success')
})

exports.setItem = (key,val) => {
    return new Promise((resolve,reject)=>{
        RedisClient.set(key,val,(err)=>{
            if(err){
                reject(err)
                return
            }

            resolve()
        })
    })
}

exports.getItem = (key) => {
    return new Promise((resolve,reject)=>{
        RedisClient.get(key,(err,data)=>{
            if(err){
                reject(err)
                return
            }

            resolve(data)
        })
    })
}

exports.setExpires = (key,time) => {
    return new Promise((resolve,reject)=>{
        RedisClient.expire(key,time,(err)=>{
            if(err){
                reject(err)
                return
            }

            resolve()
        })
    })
}





exports.RedisClient = RedisClient