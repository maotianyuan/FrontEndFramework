import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/home.vue'
import About from './views/about.vue'

Vue.use(Router)
export default ()  => {
  return new Router({
    mode:'history',
    routes: [
      {
        path: '/',
        component: Home,
      },
      {
        path: '/about',
        component: About,
      },
      {
        path: '*',
        component: {
          render (h) {
            return h('h1', {}, ['not fount'])
          }
        }
      }
    ]
  })
} 