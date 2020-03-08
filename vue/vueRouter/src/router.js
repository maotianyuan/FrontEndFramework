import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/login.vue'
import List from './views/list/list.vue'
import ListA from './views/list/a.vue'
import ListA1 from './views/list/a1.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      component: {
        render(h){ return <h1>404</h1> }
      }
    },
    {
      path: '/',
      component: {
        render(h){ return <h1>首页</h1> }
      }
    },
    {
      path: '/list',
      component:List,
      children:[
        {
          path:'a',
          component:ListA,
          children:[
            {
              path:'a1',
              component:ListA1,
            },
            {
             path:'a2',
             component:{
               render(h){return <h1>this is an list/a/a2</h1>}
             }
           }
         ]
        },
        {
         path:'b',
         component:{
           render(h){return <h1>this is an list/b</h1>}
         }
       }
     ]
    },
    {
      path: '/login',
      component:Login,
    },
  ]
})