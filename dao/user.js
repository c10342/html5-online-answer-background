const User = require('../models/user')

const util = require('../util')

const nodemailer = require('nodemailer')

const conf = require('../config')

class UserDao {
    constructor() {
        this.User = User
        this.util = util
        this.conf = conf
        this.nodemailer = nodemailer
    }

    /**
     * 用户注册
     * 
     * @param {any} { name, email, password, code, sessionCode } 
     * @returns 
     * @memberof UserDao
     */
    async register({ name, email, password, code, sessionCode }) {
        let response = null
        try {
            // 查询是否存在该邮箱
            const emailRes = await this.User.findOne({
                email
            })
            if (emailRes) {
                response = {
                    statusCode: this.conf.errorCode,
                    message: '该邮箱已经被注册过了'
                }
            } else {
                if (!sessionCode) {
                    response = {
                        statusCode: this.conf.errorCode,
                        message: '还没有获取验证码'
                    }
                } else if (sessionCode != code) {
                    response = {
                        statusCode: this.conf.errorCode,
                        message: '邮箱验证码错误'
                    }
                } else {
                    // 加密
                    password = this.util.cryptoPwd(password)
                    const user = new this.User({
                        name,
                        email,
                        password
                    })
                    // 插入数据
                    const userRes = await user.save()
                    response = {
                        statusCode: this.conf.successCode,
                        data: {
                            userInfo: userRes,
                        },
                        message: '注册成功'
                    }
                }
            }
        } catch (error) {
            response = {
                statusCode: this.conf.errorCode,
                message: error.toString()
            }
        }

        return response
    }

    /**
     * 用户登录
     * 
     * @param {any} { email, password } 
     * @returns 
     * @memberof UserDao
     */
    async login({ email, password }) {
        let respone = null;
        try {
            const userRes = await this.User.findOne({
                email
            })
            // 邮箱存在
            if (userRes) {
                // 密码不相等
                if (userRes.password != this.util.cryptoPwd(password)) {
                    respone = {
                        statusCode: this.conf.errorCode,
                        message: '密码错误'
                    }
                } else {
                    respone = {
                        statusCode: this.conf.successCode,
                        data: {
                            userInfo: userRes
                        },
                        message: '登陆成功'
                    }
                }
            } else { //邮箱不存在
                respone = {
                    statusCode: this.conf.errorCode,
                    message: '邮箱不存在'
                }
            }
        } catch (error) {
            respone = {
                statusCode: this.conf.errorCode,
                message: '服务器错误'
            }
        }
        return respone
    }

    /**
     * 修改密码
     * 
     * @param {any} { newPassword, _id, oldPassword } 
     * @returns 
     * @memberof UserDao
     */
    async updatePwd({ newPassword, _id, oldPassword }) {
        let respone = null
        try {
            const result1 = await this.User.findOne({ _id: _id })
            if (!result1) {
                respone = {
                    statusCode: this.conf.errorCode,
                    message: '用户不存在，请检查登录状态',
                }
            } else if (this.util.cryptoPwd(oldPassword) == result1.password) {
                // { new: true }获取更新后的数据
                const result2 = await this.User.findByIdAndUpdate(_id, { password: this.util.cryptoPwd(newPassword) }, { new: true })
                if (result2) {
                    respone = {
                        statusCode: this.conf.successCode,
                        message: '修改成功',
                        data: { userInfo: result2 }
                    }
                } else {
                    respone = {
                        statusCode: this.conf.errorCode,
                        message: '修改失败，请检查登录状态',
                    }
                }
            } else {
                respone = {
                    statusCode: this.conf.errorCode,
                    message: '原始密码错误'
                }
            }
        } catch (error) {
            respone = {
                statusCode: this.conf.errorCode,
                message: error.toString()
            }
        }
        return respone
    }

    /**
     * 修改用户名
     * 
     * @param {any} { _id, name } 
     * @returns 
     * @memberof UserDao
     */
    async updateName({ _id, name }) {
        let respone = null
        try {
            const result = await this.User.findByIdAndUpdate(_id, { name }, { new: true })
            if (result) {
                respone = {
                    statusCode: this.conf.successCode,
                    data: { userInfo: result },
                    message: '修改成功'
                }
            } else {
                respone = {
                    statusCode: this.conf.errorCode,
                    message: '修改失败，请检查登录状态'
                }
            }
        } catch (error) {
            respone = {
                statusCode: this.conf.errorCode,
                message: error.toString()
            }
        }
        return respone
    }
}

module.exports = UserDao