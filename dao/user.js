const User = require('../models/user')

const util = require('../util')

const nodemailer = require('nodemailer')

const conf = require('../config/index')

const Base = require('./base')

class UserDao extends Base {
    constructor() {
        super()
        this.User = User
        this.util = util
        this.nodemailer = nodemailer
        this.conf = conf
    }

    /**
     * 用户注册
     * 
     * @param {any} { name, email, password, code, sessionCode } 
     * @returns 
     * @memberof UserDao
     */
    async register({
        name,
        email,
        password,
        code,
        sessionCode,
        identity
    }) {
        try {
            // 查询是否存在该邮箱
            const emailRes = await this.User.findOne({
                email
            })
            if (emailRes) {
                throw '该邮箱已经被注册过了'
            } else {
                if (!sessionCode) {
                    throw '还没有获取验证码'
                } else if (sessionCode != code) {
                    throw '邮箱验证码错误'
                } else {
                    // 加密
                    password = this.util.cryptoPwd(password)
                    const user = new this.User({
                        name,
                        email,
                        password,
                        identity
                    })
                    // 插入数据
                    const userRes = await user.save()
                    return {
                        userInfo: userRes
                    }
                }
            }
        } catch (error) {
            throw error.toString()
        }
    }

    /**
     * 用户登录
     * 
     * @param {any} { email, password } 
     * @returns 
     * @memberof UserDao
     */
    async login({
        email,
        password
    }) {
        try {
            const userRes = await this.User.findOne({
                email
            })
            // 邮箱存在
            if (userRes) {
                // 密码不相等
                if (userRes.password != this.util.cryptoPwd(password)) {
                    throw '密码错误'
                } else {
                    return {
                        userInfo: userRes
                    }
                }
            } else { //邮箱不存在
                throw '邮箱不存在'
            }
        } catch (error) {
            throw error.toString()
        }
        // return respone
    }

    /**
     * 修改密码
     * 
     * @param {any} { newPassword, _id, oldPassword } 
     * @returns 
     * @memberof UserDao
     */
    async updatePwd({
        newPassword,
        _id,
        oldPassword
    }) {
        try {
            const result1 = await this.User.findOne({
                _id: _id
            })
            if (!result1) {
                throw '用户不存在，请检查登录状态'
            } else if (this.util.cryptoPwd(oldPassword) == result1.password) {
                // { new: true }获取更新后的数据
                const result2 = await this.User.findByIdAndUpdate(_id, {
                    password: this.util.cryptoPwd(newPassword)
                }, {
                        new: true
                    })
                if (result2) {
                    return {
                        userInfo: result2
                    }
                } else {
                    throw '修改失败，请检查登录状态'
                }
            } else {
                throw '原始密码错误'
            }
        } catch (error) {
            throw error.toString()
        }
    }

    /**
     * 修改用户名
     * 
     * @param {any} { _id, name } 
     * @returns 
     * @memberof UserDao
     */
    async updateName({
        _id,
        name
    }) {
        try {
            const result = await this.User.findByIdAndUpdate(_id, {
                name
            }, {
                    new: true
                })
            if (result) {
                return {
                    userInfo: result
                }
            } else {
                throw '修改失败，请检查登录状态'
            }
        } catch (error) {
            throw error.toString()
        }
    }

    /**
     *获取用户github信息
     *
     * @param {*} {code}
     * @memberof UserDao
     */
    async getGithubInfo({
        code
    }) {
        try {
            const accessToken = await this.util.get(this.conf.githubConf.access_token_url, {
                client_id: this.conf.githubConf.clientID,
                client_secret: this.conf.githubConf.clientSecret,
                code: code,
                redirect_uri: this.conf.githubConf.redirect_uri
            })
            const result = await this.util.get(this.conf.githubConf.user_info_url + accessToken, {}, { 'User-Agent': 'c10342' })
            if (!result || !result.id) {
                return null
            }
            const userRes = await this.User.findOne({ githubId: result.id })
            if (userRes) {
                return await this.User.findOneAndUpdate({ githubId: result.id }, {
                    name: result.name || result.login,
                    email: result.login,
                    password: this.util.cryptoPwd(result.login)
                }, {
                        new: true
                    })
            } else {
                // 加密
                let password = this.util.cryptoPwd(result.login)
                const user = new this.User({
                    name: result.name || result.login,
                    email: result.login,
                    password,
                    githubId: result.id
                })
                return await user.save()
            }
        } catch (error) {
            throw error.toString()
        }
    }

    /**
     *获取用户列表
     *
     * @param {*} { id, pageSize = 10, currentPage = 1, userName, beginTime, endTime }
     * @returns
     * @memberof UserDao
     */
    async getUserList({ email,id, pageSize = 10, currentPage = 1, name, beginTime, endTime }) {
        try {
            let params = { _id: { '$ne': id }, ...this.getParams({email, name, beginTime, endTime }) }
            const userList = await this.User.find(params)
                .skip(pageSize * (currentPage - 1))
                .limit(parseInt(pageSize))
                .sort({ '_id': -1 })
            const total = await this.User.countDocuments(params)
            return { userList, total }
        } catch (error) {
            throw error.toString()
        }
    }

    /**
     *删除用户
     *
     * @param {*} {id}
     * @memberof UserDao
     */
    async deleteUser({id}){
        try {
            const result = this.User.remove({_id:id})
            return result
        } catch (error) {
            throw error.toString()
        }
    }

    async updateJurisdiction({id,jurisdiction}){
        try {
            const result = await this.User.where({_id:id}).updateOne({jurisdiction})
            return result
        } catch (error) {
            throw error.toString()
        }
    }

}

module.exports = UserDao