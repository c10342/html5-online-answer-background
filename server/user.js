const conf = require('../config')

const UserDao = require('../dao/user')

const util = require('../util/index')

const nodemailer = require('nodemailer')

const userDao = new UserDao()

// 用户注册
exports.register = async (req, res) => {
    try {
        let {
            name,
            email,
            password,
            code
        } = req.body

        const {
            userInfo
        } = await userDao.register({
            name,
            email,
            password,
            code,
            sessionCode: req.session.code
        })

        req.session.login = true
        req.session.code = null
        res.setHeader('token', util.createToken(userInfo, conf.jwtConfig.privateKey, {
            expiresIn: conf.jwtConfig.tokenTime
        }))

        res.json({
            statusCode: conf.successCode,
            data: {
                userInfo
            },
            message: '注册成功'
        })
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString()
        })
    }
}

// 用户登录
exports.login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body

        const {
            userInfo
        } = await userDao.login({
            email,
            password
        })
        req.session.login = true
        res.setHeader('token', util.createToken(userInfo, conf.jwtConfig.privateKey, {
            expiresIn: conf.jwtConfig.tokenTime
        }))

        res.json({
            statusCode: conf.successCode,
            data: {
                userInfo
            },
            message: '登陆成功'
        })
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString()
        })
    }
}

// 发送邮箱验证码
exports.sendCode = async (req, res) => {
    try {
        const {
            email
        } = req.query
        let code = util.getCode()
        let transporter = nodemailer.createTransport({
            service: '163',
            auth: conf.auth
        })
        let mailOptions = {
            from: `在线答题系统  ${conf.auth.user}`, // sender address
            to: email, // list of receivers
            subject: '这是一封邮件', // 标题
            // 发送text或者html格式
            // text: 'Hello world?', // plain text body
            html: `<b>${code}</b>` // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.json({
                    statusCode: conf.errorCode,
                    message: error.toString()
                })
                return
            }
            req.session.code = code
            res.json({
                statusCode: conf.successCode,
                message: '发送成功',
                data: {
                    id: info.messageId
                }
            })
        });
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString(),
        })
    }
}

// 修改密码
exports.updatePwd = async (req, res) => {
    try {
        const {
            newPassword,
            _id,
            oldPassword
        } = req.body

        const {
            userInfo
        } = await userDao.updatePwd({
            newPassword,
            _id,
            oldPassword
        })

        res.json({
            statusCode: conf.successCode,
            message: '修改成功',
            data: {
                userInfo
            }
        })
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString()
        })
    }
}

// 修改用户名
exports.updateName = async (req, res) => {
    try {
        const {
            _id,
            name
        } = req.body

        const {
            userInfo
        } = await userDao.updateName({
            _id,
            name
        })

        res.json({
            statusCode: conf.successCode,
            data: {
                userInfo
            },
            message: '修改成功'
        })
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString()
        })
    }
}

// 用户退出登录
exports.logout = (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            res.json({
                statusCode: conf.errorCode,
                message: '退出登录失败'
            });
            return;
        }
        res.clearCookie(conf.sessionName);
        res.json({
            statusCode: conf.successCode,
            message: '退出登录'
        })
    });
}

exports.getGithubInfo = async (req, res) => {
    try {
        const {
            code
        } = req.query
        const result = await userDao.getGithubInfo({
            code
        })
        if (result.id) {
            req.session.login = true
            res.setHeader('token', util.createToken({
                _id: result.id,
                name: result.name,
                email: result.login,
                createTime: result.created_at,
                password: result.login
            }, conf.jwtConfig.privateKey, {
                expiresIn: conf.jwtConfig.tokenTime
            }))
            res.json({
                statusCode: conf.successCode,
                message: '成功',
                data: {
                    userInfo: {
                        _id: result.id,
                        name: result.name,
                        email: result.login,
                        createTime: result.created_at,
                        password: result.login
                    }
                }
            })
        } else {
            res.json({
                statusCode: conf.errorCode,
                message: '获取用户信息失败',
            })
        }
    } catch (error) {
        res.json({
            statusCode: conf.errorCode,
            message: error.toString()
        })
    }
}