const Koa = require('koa')
const Router = require('koa-router')
const static = require('koa-static')
const path = require('path')
const fs = require('fs')
const consola = require('consola')
const ServerRenderer = require('vue-server-renderer')

const template = fs.readFileSync(path.resolve(__dirname, 'build/server.html'), 'utf8');
const ServerBundle = require('./build/vue-ssr-server-bundle.json')
const clientManifest = require('./build/vue-ssr-client-manifest.json');

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

const render = ServerRenderer.createBundleRenderer(ServerBundle, {
  template,
  clientManifest
})

const app = new Koa()

const router = new Router()

router.get('/', async ctx => {
  ctx.body = await new Promise((resolve, reject) => {
    render.renderToString({url:'/'}, (err, data) => {
        if (err) {
            console.log(err);
            reject(err);
        } else {
            resolve(data);
        }
    })
  })
})

router.get('*', async ctx => {
  try {
      ctx.body = await new Promise((resolve, reject) => {
          render.renderToString({url:ctx.path},(err, data) => {
              if (err) {
                  console.log(err);
                  reject(err);
              } else {
                  resolve(data);
              }
          })
      })
  } catch (e) {
      ctx.body = '404'
  }
})

app.use(static(path.resolve(__dirname, 'build')))
app.use(router.routes())

app.listen(port, host)
consola.ready({
  message: `Server listening on http://${host}:${port}`,
  bdage: true,
})