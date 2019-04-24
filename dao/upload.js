const XLSX = require('xlsx');
const util = require('../util/index')

class UploadDao {
    constructor() {
        this.util = util
    }

    /**
     * 解析excel文件
     * 
     * @param {any} excelFile 
     * @returns 
     * @memberof UploadDao
     */
    handelData(excelFile) {
        try {
            let obj = {}
            let sheets = XLSX.read(excelFile);// 解析Excel，sheets存的一个Excel页签
            // 获取标签页
            let sheetNames = sheets.SheetNames
            let message = ''
            sheetNames.forEach(item => {
                let { "!margins": a, '!ref': b, ...data } = sheets.Sheets[item]
                let d = this[item](data)
                obj[item] = d.data
                if (d.message) {
                    message += d.message + ','
                }
            });
            message = message ? message.substring(0, message.length - 1) + '解析失败' : ''
            return {
                data: {
                    question: obj
                },
                message
            }
        } catch (error) {
            throw error.toString()
        }
    }

    /**
     * 解析单选题
     * 
     * @param {any} data 
     * @returns 
     * @memberof UploadDao
     */
    single(data) {
        try {
            let arr = []
            for (let key in data) {
                let item = data[key]
                arr.push(item)
            }

            if (arr.length % 6 != 0) {
                return { message: '单选题', data: [] }
            }

            let single = []
            for (let i = 0; i < arr.length; i += 6) {
                let id = this.util.getRandomStr()
                let j = i
                single.push({
                    id,
                    title: arr[j].w,
                    options: { A: arr[++j].w, B: arr[++j].w, C: arr[++j].w, D: arr[++j].w },
                    answer: arr[++j].w,
                    message: ""
                });
            }
            return { data: single }
        } catch (error) {
            throw new Error(error)
        }
    }

    /**
     * 解析多选题
     * 
     * @param {any} data 
     * @returns 
     * @memberof UploadDao
     */
    multiple(data) {
        try {
            let arr = []
            for (let key in data) {
                let item = data[key]
                arr.push(item)
            }
            if (arr.length % 6 != 0) {
                return { message: '多选题', data: [] }
            }

            let multiple = []
            for (let i = 0; i < arr.length; i += 6) {
                let id = this.util.getRandomStr()
                let j = i
                multiple.push({
                    id,
                    title: arr[j].w,
                    options: { A: arr[++j].w, B: arr[++j].w, C: arr[++j].w, D: arr[++j].w },
                    answer: arr[++j].w.split(','),
                    message: ""
                });
            }
            return { data: multiple }
        } catch (error) {
            throw new Error(error)
        }
    }

    /**
     * 解析判断题
     * 
     * @param {any} data 
     * @returns 
     * @memberof UploadDao
     */
    judgement(data) {
        try {
            let arr = []
            for (let key in data) {
                let item = data[key]
                arr.push(item)
            }
            if (arr.length % 2 != 0) {
                return { message: '判断题', data: [] }
            }

            let judgement = []
            for (let i = 0; i < arr.length; i += 2) {
                let id = this.util.getRandomStr()
                let j = i
                judgement.push({
                    id,
                    title: arr[j].w,
                    answer: arr[++j].w == '对' ? 'A' : 'B',
                    message: ""
                });
            }
            return { data: judgement }
        } catch (error) {
            throw new Error(error)
        }
    }

    /**
     * 解析简答题
     * 
     * @param {any} data 
     * @returns 
     * @memberof UploadDao
     */
    answer(data) {
        try {
            let arr = []
            for (let key in data) {
                let item = data[key]
                arr.push(item)
            }
            if (arr.length % 2 != 0) {
                return { message: '简答题', data: [] }
            }

            let answer = []
            for (let i = 0; i < arr.length; i += 2) {
                let id = this.util.getRandomStr()
                let j = i
                answer.push({
                    id,
                    title: arr[j].w,
                    answer: arr[++j].w,
                    message: ""
                });
            }
            return { data: answer }
        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = UploadDao