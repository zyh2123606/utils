/**
 *@abstract zouyonghong
 *@description 基于XMLHttpRequest封装
 *@create 2019-04-01
 * @class Ajax
 */
class Ajax{
    constructor(){
        this.isTimeOut = false
        this.timeOutFlag = null
        this.config = {
            timeOut: 30000,
            contentType: 'application/json;charset=UTF-8'
        }
        this.GLOBAL_XHR = this._init()
    }
    _init(){
        if(window.XMLHttpRequest) return new XMLHttpRequest()
        if(window.ActiveXObject){
            const ActiveXObject = new window.ActiveXObject()
            if(arguments.callee.activeXString != 'string'){
                let msHttp = ['MSXML2.XMLHTTP.6.0','MSXML2.XMLHTTP.3.0','MSXML2.XMLHTTP']
                msHttp.map((msx)=>{
                    try{
                        new ActiveXObject(msx)
                        arguments.callee.activeXString = msx
                    }catch(ex){
                        throw new Error('ActiveXObjext not found')
                    }
                })
                return new ActiveXObject(arguments.callee.activeXString)
            }
        }
    }
    _buildRequest(){
        return new Promise((resolve, reject) => {
            this.GLOBAL_XHR.onreadystatechange = res => {
                if(this.GLOBAL_XHR.readyState === 4 && !this.isTimeout){
                    clearTimeout(this.timeOutFlag)
                    if(this.GLOBAL_XHR.status === 200)
                        return resolve(this._success(res))
                    this._fail(this.GLOBAL_XHR.status)
                    setTimeout(() => {
                        this.GLOBAL_XHR.onreadystatechange = null
                    }, 10)
                }
            }
    
            //超时检测
            this.timeOutFlag = setTimeout(()=>{
                this.isTimeOut = true
                clearTimeout(this.timeOutFlag)
                this._fail(408)
            }, this.config.timeOut)
        })
    }
    _success = (response) => {
        try{
            return JSON.parse(response.currentTarget.responseText)
        }catch(e){
            console.log(e)
        }
    }
    _fail(status){

    }
    _combinParams(params){
        let paramStr = []
        for(var p in params){
            paramStr.push(encodeURIComponent(p) + '=' + encodeURIComponent(params[p]))
        }
        return paramStr.join('&')
    }
    get = (url, params='', config = '') => {
        params = this._combinParams(params)
        this.GLOBAL_XHR.open('GET',url + '?' + params, true)
        this.GLOBAL_XHR.send(null)
		return this._buildRequest()
    }
    post = (url, params='', config = '') => {
        params = this._combinParams(params)
        this.GLOBAL_XHR.open('POST', url, false)
        this.GLOBAL_XHR.setRequestHeader("Content-Type","application/json;charset=UTF-8")
        this.GLOBAL_XHR.send(params)
        return this._buildRequest()
    }
    postForm = (url, params = {}, config = {}) => {
        
    }
}

const _AJAX_ = new Ajax()
export default { get: _AJAX_.get, post: _AJAX_.post }