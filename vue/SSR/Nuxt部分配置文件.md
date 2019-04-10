## Nuxt.js介绍

- nuxt.config.js
```js
const pkg = require('./package')
module.exports = {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [{
        charset: 'utf-8'
      },
      {
        hid: 'description',
        name: 'description',
        content: pkg.description
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.png'
    }]
    script: [{
      src: 'http://api.map.baidu.com/api?v=2.0&ak=你的ak'
    }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#27d38a'
  },

  /*
   ** Global CSS
   */
  css: [{
      src: 'element-ui/lib/theme-chalk/index.css'
    },
    {
      src: 'assets/css/com/com.less',
      lang: 'less'
    }
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{
      src: '@/plugins/analysis.js',
      ssr: false
    }, {
      src: '@/plugins/jspdf.debug.js', // false 客户端再加载
      ssr: false
    }, {
      src: '@/plugins/element-ui',
    },
    {
      src: '@/plugins/echarts.js',
    },
    {
      src: '@/plugins/axios.config.js',
    }
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // baseURL:process.env._ENV=='production'?'http://localhost:8080':'/mock',
    baseURL: '/mock',
    withCredentials: true
  },
  proxy: [
    ['/mock', {
      target: process.env.API == 'test' ? 'https://test.data.com' : 'https://test.data.com',
      changeOrigin: true,
      pathRewrite: {
        '^/mock': '/'
      }
    }]
  ],
  env: {
    __ENV: process.env.__ENV,
    baseUrl: process.env.API == 'test' ? 'https://test.data.com' : 'https://test.data.com',
    API: process.env.API
  },
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'custom',
        path: '*',
        component: resolve(__dirname, 'pages/404.vue')
      }, {
        path: "/",
        component: resolve(__dirname, 'pages/task/list.vue')
      })
    }
  },


  /*
   ** Build configuration
   */
  build: {
    build: {
      vendor: ['Cookie', 'axios']
    }
    /*
     ** Run ESLint on save
     */
    // vendor: [
    //   'babel-polyfill'
    // ],
    // babel: {
    //   presets: ['es2015', 'stage-0'],
    //   plugins: [
    //     "transform-runtime"
    //   ]
    // }
    // extend(config, { isDev, isClient }) {
    //   if (!isClient) {
    //     // This instructs Webpack to include `vue2-google-maps`'s Vue files
    //     // for server-side rendering
    //     config.externals.splice(0,0,function (context, request, callback) {
    //       if (/^vue2-google-maps($|\/)/.test(request)) {
    //         callback(null, false)
    //       } else {
    //         callback()
    //       }
    //     })
    //   }
    // }
  },
}

```

package.json 部分
```json
  "scripts": {
    "dev": "cross-env NODE_ENV=development API=test nodemon server/index.js --watch server",
    "build": "nuxt build",
    "start": "cross-env NODE_ENV=production API=test node server/index.js",
    "generate": "nuxt generate",
    "mock": "nodemon mock/server.js",
    "restart": "pm2 startOrRestart ecosystem.json",
    "test": "pm2 deploy ecosystem.json test",
    "online": "pm2 deploy ecosystem.json online"
  },
```

- vue 新增api部分
```js
export default {
  layout: 'admin/adminHome', // 默认值layouts/defaults
  middleware: 'auth', // 中间件
  head() { 
    return {
      title: '标题',
      meta: [{
        hid: 'description',
        name: 'visit',
        content: '描述信息'
      }]
    }
  },
  // 路由参数校验
  validate({
    params
  }) {
    return /^\d+$/.test(params.reportId)
  },
  async asyncData ({ params }) {
    let { data } = await axios.get(`https://my-api/posts/${params.id}`)
    return { title: data.title }
  }
  
}
```

- middleware 中间件实例 
```js
import {
  getApiToken
} from '@/config/utils'
export default function({
  app: {
    router
  },
  store,
  $axios,
  req,
  route,
  redirect
}) {
  var path, redirectURL;
  let api_token = getApiToken(req)
  if (process.server) {
    path = req.originalUrl;
  }
  if (process.client) {
    path = route.path;
  }
  if (path) {
    if (!api_token) {
      redirectURL = '/?ref=' + path
      return redirect(redirectURL)
    }
  }
}

```
- server.js
```js

const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

const app = new Koa()
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 8080
// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')
async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(ctx => {
    ctx.status = 200 // koa defaults to 404 when it sees that status is unset
    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve)
      ctx.res.on('finish', resolve)
      nuxt.render(ctx.req, ctx.res, promise => {
        // nuxt.render passes a rejected promise into callback on error.
        promise.then(resolve).catch(reject)
      })
    })
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
```


>分享
[Nuxt官网](https://zh.nuxtjs.org/guide/installation/)