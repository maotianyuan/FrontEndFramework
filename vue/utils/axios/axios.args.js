import { Message, MessageBox } from 'element-ui'
const { NODE_ENV, VUE_APP_PROXY_SIGN } = process.env
const exclude = []
const NO_LOGIN_STATUS_CODE = 419 // 未登陆或token失效报错code
const UPDATE_TOKEN = 'UPDATE_TOKEN'
class AxoisArgs {
  constructor (store, opt = {}) {
    const { token = '' } = opt
    this.store = store
    this.TOKEN_API_RUI = token // token api
    const baseURL = NODE_ENV !== 'production' ? VUE_APP_PROXY_SIGN : undefined
    return {
      baseURL,
      beforeSend: this.beforeSend.bind(this),
      interceptors: this.interceptors.bind(this),
      setLoading: this.setLoading.bind(this),
      errorHandler: this.errorHandler.bind(this)
    }
  }
  beforeSend ({ url, options = {} }) {
    // 禁止Message提示
    if (options.noMessage && !exclude.includes(url)) {
      exclude.push(url)
    }
    if (url === `/${this.TOKEN_API_RUI}`) return
    if (NODE_ENV !== 'production' && this.store.state.token.includes('csrf_token')) {
      return this.store.dispatch(UPDATE_TOKEN)
    }
    if (!this.store.state.token) return this.store.dispatch(UPDATE_TOKEN)
  }
  interceptors (config) {
    config.headers['X-CSRF-TOKEN'] = this.store.state.token
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    return config
  }
  setLoading (key, value) {
    if (key) {
      this.store.commit('SET_LOADING', { [key]: value })
    }
  }
  errorHandler (error) {
    if (!error) return
    const { config = {}, data = {}, response = {} } = error
    if (response.status === NO_LOGIN_STATUS_CODE) {
      MessageBox.alert('登录已过期，点击确认刷新', '提示').then(() => {
        window.location.reload()
      })
    }
    if (config.url && exclude.includes(config.url.replace(config.baseURL || '', ''))) return
    const message = data.message || error.message
    message && Message({
      type: 'error',
      message
    })
    if (message) {
      const { url, data, params } = config
      const { username: account } = this.store.getters.userInfo
      return {
        message,
        data: {
          url,
          data,
          params,
          account
        }
      }
    }
  }
}

export default AxoisArgs
