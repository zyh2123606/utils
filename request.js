import Axios from 'axios'
import { Message } from 'antd'

const http = Axios.create({ baseUrl: '' })
const cancelToken = Axios.CancelToken
const source = cancelToken.source()

//状态处理
const dealWithRequestError = error => {
    const status = (error && error.response)?error.response.status:''
    const msgInfo = ''
    switch(status){
        case 400: msgInfo = '请求出错'
            break
        case 401: msgInfo = '没有权限'
            break
        case 403: msgInfo = '访问被拒绝'
            break
        case 404: msgInfo = '请求地址出错'
            break
        case 408: msgInfo = '请求超时'
            break
        case 500: msgInfo = '服务器内部出错'
            break
        case 501: msgInfo = '服务未实现'
            break
        case 502: msgInfo = '网关出错'
            break
        case 503: msgInfo = '服务不可用'
            break
        case 504: msgInfo = '网关超时'
            break
        case 505: msgInfo = 'HTTP版本不支持'
            break
        default:
            break
    }
    Message.warning(msgInfo)
}

//默认配置
const defaultConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    withCredentials: true,
    timeout: 30000
}

//请求前
const beforeRequest = config => {
    config.headers.common['Authorization'] = ''
    return config
}

//数据解析
const dataFormat = response => {
    if(!response) return
    const { code, data, msg } = response.data || {}
    if(typeof code !== 'undefined' && code !== 200) Message.warning(msg || '未知错误')
    return data
}

//构建请求
const buildRequest = async (method, url, params, config) => {
    config = { ...defaultConfig, ...config }
    http.interceptors.request.use(req => beforeRequest(req))
    http.interceptors.response.use(response => dataFormat(response), error => dealWithRequestError(error))
    if(method === 'delete') return http[method](url, {params, ...config})
    return http[method](url, params, config)
}

export const get = (url, params = {}, config = {}) => buildRequest('get', url, params, config)
export const post = (url, params = {}, config = {}) => buildRequest('post', url, params, config)
export const put = (url, params = {}, config = {}) => buildRequest('put', url, params, config)
export const del = (url, params = {}, config = {}) => buildRequest('delete', url, params, config)
export const postForm = (url, params, config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}) => buildRequest('post', url, params, config) 
export const all = iterable => Axios.all(iterable)
export const cancel = source => cancel