import axios from 'axios'
import { axiosAllSpread } from './axios.all'
const httpErrorMessage = {
  400: '请求错误',
  401: '未授权，请登录',
  403: '拒绝访问',
  404: '请求地址出错',
  408: '请求超时',
  500: '服务器内部错误',
  501: '服务未实现',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
  505: 'HTTP版本不受支持'
}

const TIMEOUT = 20 * 1e3 // 超时时间20s
const CancelToken = axios.CancelToken

const loop = () => {}
const isFunction = t => typeof t === 'function'

axios.$utils = {
  get (data, keys, defaults) {
    if (data === null || typeof data !== 'object') return data
    const fields = Array.isArray(keys) ? keys : String(keys).split('.')
    const toString = Object.prototype.toString
    const defaultType = toString.call(defaults)
    let value = data
    const len = fields.length
    for (let i = 0; i < len; i++) {
      const k = fields[i]
      value = value[k]
      if (value !== null && typeof value === 'object') continue
      break
    }
    if (typeof defaults === 'undefined' || toString.call(value) === defaultType) return value
    return defaults
  }
}

class AxiosConfig {
  constructor (options) {
    const { debug, baseURL = '/', interceptors, responseHandler, errorHandler, setLoading = loop, beforeSend } = options
    this.debug = debug
    this.errorHandler = errorHandler
    this.setLoading = setLoading
    this.beforeSend = beforeSend
    this.init(baseURL)
    this.interceptors(interceptors, responseHandler)
    this.axiosGet()
    this.axiosPost()
  }
  init (baseURL) {
    axios.defaults.retry = 2 // 超时重试次数
    axios.defaults.retryDelay = 500 // 超时重试间隔
    axios.defaults.tokenList = {} // cancelToken列表
    axios.defaults.baseURL = baseURL
    axios.defaults.withCredentials = true
    axios.defaults.timeout = TIMEOUT
    axios.axiosAllSpread = axiosAllSpread
  }
  interceptors (interceptors, responseHandler) {
    const reqHandleFunc = (interceptors) => {
      if (interceptors) {
        axios.interceptors.request.use(config => interceptors(config))
      }
    }
    const resHandleFunc = (responseHandler) => {
      axios.interceptors.response.use(
        response => {
          if (isFunction(responseHandler)) return responseHandler(response.data, response)
          return response
        },
        error => {
          if (error) {
            if (error.response) {
              let { status, config } = error.response
              const message = httpErrorMessage[status]
              error.message = status === 404 ? `${message}:${config.url}` : message
            }
          }
          /**
           * 超时重试处理
           */
          const config = error.config || {}
          const { status } = error.response || {}
          config.__retryCount = config.__retryCount || 0
          // 有重试次数且请求状态不为500或419时继续重试
          const needRetry = config.retry > 0 && config.__retryCount < config.retry && (!status || /^[^345]\d{2}/.test(status))
          if (needRetry) {
            config.__retryCount++
            return new Promise(resolve => {
              setTimeout(resolve, config.retryDelay || 1)
            }).then(() => axios({ ...config, baseURL: '' }))
          }
          return Promise.reject(error)
        }
      )
    }
    reqHandleFunc(interceptors)
    resHandleFunc(responseHandler)
  }
  axiosPost () {
    const axiosPost = axios.post
    axios.post = (url, params, options) =>
      this.handleWrap(axiosPost, {
        url,
        params,
        options
      })
  }
  axiosGet () {
    const axiosGet = axios.get
    axios.get = (url, params, options) =>
      this.handleWrap((url, params, opt) => axiosGet(url, { params, ...opt }), {
        url,
        params,
        options
      })
  }
  async handleWrap (handle, opt = {}) {
    const { url, params = {} } = opt
    const { loading, cancel, get, default: defaultValue, ...options } = opt.options || {}
    // 创建cancelToken, 取消重复请求
    const cancelToken = this.handleCancel(cancel, `取消请求: ${url}; 请求参数:${JSON.stringify(params)}`)
    // 开启loading
    this.setLoading(loading, true)
    if (this.beforeSend) {
      await this.beforeSend(opt)
    }
    // 移除参数中的空值
    const data = this.removeEmptyValue(params)

    return new Promise((resolve, reject) => {
      handle(url, data, { ...options, cancelToken })
        .then(data => {
          // 可选链式调用
          if (get) {
            const _data = axios.$utils.get(data.data, get, defaultValue)
            resolve(_data)
          } else {
            resolve(data)
          }
          // 请求结束之后关闭loading
          this.setLoading(loading, false)
          // 清除canceltoken
          if (typeof cancel === 'string') {
            this.clearToken(cancel)
          }
        })
        .catch(error => {
          // 请求结束之后关闭loading
          this.setLoading(loading, false)
          // 清除canceltoken
          if (typeof cancel === 'string') {
            this.clearToken(cancel)
          }
          // 被取消的请求不需要抛出错误
          if (axios.isCancel(error)) {
            this.debug && console.log(error.message)
          } else {
            if (isFunction(this.errorHandler)) {
              const err = this.errorHandler(error)
              if (err instanceof Promise) return err.then(resolve).catch(reject)
              if (err) reject(err)
            } else {
              reject(error)
            }
          }
        })
    })
  }
  /**
   * 清除已有的cancelToken
   * @param {string} token
   * @param {boolean} cancel 是否执行取消
   */
  clearToken = (token, cancel) => {
    if (!token) return
    const { source, data = {} } = axios.defaults.tokenList[token] || {}
    cancel && source && source.cancel(JSON.stringify(data))
    delete axios.defaults.tokenList[token]
  }
  handleCancel = (cancel, data) => {
    if (!cancel) return
    const list = axios.defaults.tokenList
    const source = CancelToken.source()
    switch (typeof cancel) {
      case 'function':
        cancel(source, data)
        break
      case 'string':
        this.clearToken(cancel, true)
        list[cancel] = {
          source,
          data
        }
        break
      default:
        break
    }
    return source.token
  }
  removeEmptyValue (params) {
    if (params instanceof FormData || typeof params !== 'object' || Array.isArray(params)) return params
    const result = {}
    for (let k in params) {
      const value = params[k]
      if (value === '' || value === null) continue
      result[k] = value
    }
    return result
  }
}

axios.install = (Vue, options = {}) => {
  // eslint-disable-next-line no-new
  new AxiosConfig(options)
  Vue.prototype.$http = Vue.prototype.axios = Vue.prototype.$axios = axios
  Vue.prototype.$axiosAllSpread = axiosAllSpread
}

export default axios
