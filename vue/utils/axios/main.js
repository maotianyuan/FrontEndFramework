import Vue from 'vue'
import App from './App.vue'
import store from './store'
import axios from '@/lib/axios'
import AxoisArgs from '@/lib/axios.args'

// Vue axios使用示例
Vue.use(axios, new AxoisArgs(store, { token: 'admin' }))

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
