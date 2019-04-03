const express = require('express')

const router = express.Router()

const user = require('../server/user')

// 用户注册
router.post('/register',user.register)

// 用户登录
router.post('/login',user.login)

// 发送邮箱验证码
router.get('/sendCode',user.sendCode)

// 修改密码
router.post('/updatePwd',user.updatePwd)

// 修改用户名
router.post('/updateName',user.updateName)

// 退出登录
router.get('/logout',user.logout)

module.exports = router