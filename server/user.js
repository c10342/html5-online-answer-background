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

        const result = await userDao.register({ name, email, password, code, sessionCode: req.session.code })

        if (result.statusCode == 200) {
            req.session.login = true
            req.session.code = null
        }

        res.json(result)
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

        const result = await userDao.login({ email, password })
        if (result.statusCode == 200) {
            req.session.login = true
        }
        res.json(result)
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
        const { email } = req.query
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
                data: { id: info.messageId }
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
        const { newPassword, _id, oldPassword } = req.body

        const result = await userDao.updatePwd({ newPassword, _id, oldPassword })

        res.json(result)
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
        const { _id, name } = req.body

        const result = await userDao.updateName({ _id, name })

        res.json(result)
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
            res.json({ statusCode: conf.errorCode, message: '退出登录失败' });
            return;
        }
        res.clearCookie(conf.sessionName);
        res.json({
            statusCode: conf.successCode,
            message: '退出登录'
        })
    });
}