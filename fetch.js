import Axios from 'axios'
import { Message } from 'antd'

/**
 *基于axios的ajax类封装
 *
 * @class Fetxh
 */
class Fetxh{
    constructor(base_url = '/'){
        const cancelToken = Axios.CancelToken
        this.source = cancelToken.source()
        this.http = Axios.create({baseURL: base_url})
        this.http.interceptors.request.use(req => this.beforeRequest(req))
        this.http.interceptors.response.use(response => this.dataFormat(response), error => this.dealWithRequestError(error))
        this.defaultConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            withCredentials: true,
            timeout: 30000
        }
    }
    beforeRequest(config){
        config.headers.common['Authorization'] = ''
        return config
    }
    dataFormat(response){
        if(!response) return
        const { code, data, msg } = response.data || {}
        if(typeof code !== 'undefined' && code !== 200) Message.warning(msg || '未知错误')
        return data
    }
    dealWithRequestError(error){
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
    buildRequest(method, url, params={}, config={}){
        config = { ...this.defaultConfig, ...config }
        if(method === 'delete') return this.http[method](url, {params, ...config})
        return this.http[method](url, params, config)
    }
    post = (url, params, config) => this.buildRequest('post', url, params, config)
    get = (url, params, config) => this.buildRequest('get', url, params, config)
    put = (url, params, config) => this.buildRequest('put', url, params, config)
    delete = (url, params, config) => this.buildRequest('delete', url, params, config)
    postForm = (url, params, config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }) => this.buildRequest('post', url, params, config) 
    all = iterable => Axios.all(iterable)
    cancel = () => this.source.cancel
}

export default Fetxh