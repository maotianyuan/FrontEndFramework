## vue.config.js

### 目录

- 1.publicPath [string, '/']
- 2.outputDir [string, 'dist']
- 3.assetsDir [string, '']
- 4.indexPath [string, 'index.html']
- 5.filenameHashing [boolean,true]
- 6.pages [Object,undefined]
- 7.lintOnSave [boolean|'error',true]
- 8.productionSourceMap [boolean, true]
- 9.configureWebpack [Object | Function]
- 10.chainWebpack [Function]
- 11.css.modules css.sourceMap [boolean, false]
- 12.devServer [Object]
- 13.Babel
- 14.pluginOptions [Object]
- 15.transpileDependencies [Array<string | RegExp>, []]
- 16.vue-cli-service serve --mode mock
- 17.env 文件与环境变量
- 18.例子 multi-page
- 19.例子 single-page

#### 1.publicPath [string, '/']

> Vue CLI 会假设你的应用是被部署在一个域名的根路径上，例如 https://www.my-app.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.my-app.com/my-app/，则设置 publicPath 为 /my-app/

```js
publicPath: process.env.NODE_ENV === "production" ? "/static/" : "/";
```

#### 2.outputDir [string, 'dist']

> 当运行 vue-cli-service build 时生成的生产环境构建文件的目录

```js
outputDir: isProd && process.env.OUTPUT_DIR
  ? resolve(process.env.OUTPUT_DIR)
  : undefined;
```

#### 3.assetsDir [string, '']

> 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。

```js
// [少用] 例如：outpuDir:'build' 则打包后为build/static/public/
assetsDir: "public";
```

#### 4.indexPath [string, 'index.html']

> 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。

```js
indexPath: "../../resources/views/index.blade.php";
```

#### 5.filenameHashing [boolean,true]

> 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。然而，这也要求 index 的 HTML 是被 Vue CLI 自动生成的。如果你无法使用 Vue CLI 生成的 index HTML，你可以通过将这个选项设为 false 来关闭文件名哈希。Default: true

#### 6.pages [Object,undefined]

> 在 multi-page 模式下构建应用。每个“page”应该有一个对应的 JavaScript 入口文件。其值应该是一个对象，对象的 key 是入口的名字，value 是：

- 一个指定了 entry, template, filename, title 和 chunks 的对象 (除了 entry 之外都是可选的)；
- 或一个指定其 entry 的字符串

```js
module.exports = {
  pages: {
    index: {
      // page 的入口
      entry: "src/index/main.js",
      // 模板来源
      template: "public/index.html",
      // 在 dist/index.html 的输出
      filename: "index.html",
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: "Index Page",
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", "index"],
    },
    // 当使用只有入口的字符串格式时，
    // 模板会被推导为 `public/subpage.html`
    // 并且如果找不到的话，就回退到 `public/index.html`。
    // 输出文件名会被推导为 `subpage.html`。
    subpage: "src/subpage/main.js",
  },
};
```

```js 实例2

function getPages (pages) {
  return pages.reduce((result, { name, title }) => {
    const filename = isProd
      ? resolve(process.env.VIEWS_PATH, `${name}.blade.php`)
      : `${name}.html`
    console.log(filename)
    result[name] = {
      entry: `src/app/${name}/main.js`,
      template: 'public/index.html',
      title,
      filename
    }
    return result
  }, {})
}
  pages: getPages([
    {
      name: 'index',
      title: 'xxx'
    },
    {
      name: 'admin',
      title: 'xxx'
    }
  ]),
```

#### 7.lintOnSave [boolean|'error',true]

> 设置为 true 时，eslint-loader 会将 lint 错误输出为编译警告。默认情况下，警告仅仅会被输出到命令行，且不会使得编译失败。

> 如果你希望让 lint 错误在开发时直接显示在浏览器中，你可以使用 lintOnSave: 'error'。这会强制 eslint-loader 将 lint 错误输出为编译错误，同时也意味着 lint 错误将会导致编译失败

通过设置让浏览器 overlay 同时显示警告和错误：

```js
module.exports = {
  devServer: {
    overlay: {
      warnings: true,
      errors: true,
    },
  },
};
```

```js
module.exports = {
  lintOnSave: process.env.NODE_ENV !== "production",
};
```

#### 8.productionSourceMap [boolean, true]

> 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。一般在生产环境下为了快速定位错误信息，我们都会开启 source map

#### 9.configureWebpack [Object | Function]

```js
configureWebpack: {
  plugins: [new MyAwesomeWebpackPlugin()];
}

////
configureWebpack: (config) => {
  if (process.env.NODE_ENV === "production") {
    // 为生产环境修改配置...
  } else {
    // 为开发环境修改配置...
  }
};
```

```js
  开启gzip
  npm i -D compression-webpack-plugin

  configureWebpack: config => {
    if (isProd) {
      return {
        plugins: [
          /* gzip压缩 */
          new CompressionPlugin({
            test: /\.js$|\.html$|.\css/, // 匹配文件名
            threshold: 10240, // 对超过10k的数据压缩
            deleteOriginalAssets: false // 不删除源文件
          }),
          new LodashPlugin()
        ]
      }
    }
  },
```

#### 10.chainWebpack [Function]

[webpack-chain](https://github.com/neutrinojs/webpack-chain)

```js
chainWebpack: config => {

    config
      .plugin('html-index')
      .tap(appendHtmlWebpackOptions)
    config
      .plugin('html-admin')
      .tap(appendHtmlWebpackOptions)

    // 添加别名
    const index = './src'
    config.resolve.alias
      .set('store', resolve(index, 'store'))
      .set('router', resolve(index, 'router'))
      .set('lib', resolve(index, 'lib'))
      .set('views', resolve(index, 'views'))
      .set('components', resolve(index, 'components'))
      .set('constant', resolve(index, 'constant'))
      .set('assets', resolve(index, 'assets'))
      .set('layout', resolve(index, 'layout'))
      .set('@', resolve(index))

    if (isProd) {
      /* 图片压缩 */
      config.module
        .rule('images')
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .tap(() => {
          return {
            mozjpeg: {
              progressive: true,
              quality: 65
            },
            // optipng.enabled: false will disable optipng
            optipng: {
              enabled: false
            },
            pngquant: {
              quality: '65-90',
              speed: 4
            }
          }
        })
    }
  },
```

#### 11.css.modules css.sourceMap[boolean|false]

[css-modules.html#用法](https://vue-loader.vuejs.org/zh/guide/css-modules.html#%E7%94%A8%E6%B3%95)

```js
module.exports = {
  css: {
    loaderOptions: {
      css: {
        // options here will be passed to css-loader
      },
      postcss: {
        // options here will be passed to postcss-loader
        plugins: [
          require("postcss-px2rem")({
            remUnit: 75,
          }),
        ],
      },
    },
  },
};
```

```js
// npm install --save lib-flexible
// npm install --save-dev postcss-loader postcss-px2rem
// import 'lib-flexible/flexible.js'

 // CSS 相关选项
    css: {
        // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
        // 也可以是一个传递给 `extract-text-webpack-plugin` 的选项对象
        extract: true,

        // 是否开启 CSS source map？
        sourceMap: false,

        // 为预处理器的 loader 传递自定义选项。比如传递给
        // sass-loader 时，使用 `{ sass: { ... } }`。
        loaderOptions: {},

        // 为所有的 CSS 及其预处理文件开启 CSS Modules。
        // 这个选项不会影响 `*.vue` 文件。
        modules: false
    },
```

#### 12.devServer

```js
  devServer: {
    public: 'xxx.test.com',
    open: false,
    host: '0.0.0.0',
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: `http://test-test.cm.com`,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    historyApiFallback: {
      rewrites: [
        { from: /^\/admin/, to: '/admin.html' }
      ]
    }
  },
```

#### 13.Babel

> 我们推荐在 Vue CLI 项目中始终使用 babel.config.js 取代其它格式。

#### 14.pluginOptions

> 这是一个不进行任何 schema 验证的对象，因此它可以用来传递任何第三方插件选项

```js
pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, './src/assets/styles/common/index.scss')
      ]
    }
  },
```

#### 15.transpileDependencies

> 默认情况下，babel-loader 会排除 node_modules 依赖内部的文件。如果希望显性编译一个依赖的模块，你需要将其添加入 vue.config.js 中的 transpileDependencies 选项：

```js
  transpileDependencies: [
    'vuex-persist',
    'vue-echarts',
    'resize-detector'
  ],
```

#### 16. vue-cli-service serve --mode mock

> vue-cli-service serve --mode mock // 此处的 mock 访问.env.mock 中的 mock 字段

#### 17.env 文件与环境变量

```js
.env                # 在所有的环境中被载入
.env.local          # 在所有的环境中被载入，但会被 git 忽略
.env.[mode]         # 只在指定的模式中被载入
.env.[mode].local   # 只在指定的模式中被载入，但会被 git 忽略
.env.[mode].local > .env.[mode] > .env.local > .env

NODE_ENV=stage
VUE_APP_TITLE=stage mode

// vue.config.js
console.log(process.env.NODE_ENV); // development（在终端输出）
```

#### 18.例子 multi-page

```js
const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
const LodashPlugin = require("lodash-webpack-plugin");
const isProd = process.env.NODE_ENV === "production";
function resolve() {
  return path.join(__dirname, ...Array.from(arguments));
}

function appendHtmlWebpackOptions(args) {
  if (args.length === 0) return args;
  let token = () => (isProd ? "{{csrf_token()}}" : Date.now());
  args[0].token = token;
  return args;
}

function getPages(pages) {
  return pages.reduce((result, { name, title }) => {
    const filename = isProd
      ? resolve(process.env.VIEWS_PATH, `${name}.blade.php`)
      : `${name}.html`;
    console.log(filename);
    result[name] = {
      entry: `src/app/${name}/main.js`,
      template: "public/index.html",
      title,
      filename,
    };
    return result;
  }, {});
}

const outputDir =
  isProd && process.env.OUTPUT_DIR
    ? resolve(process.env.OUTPUT_DIR)
    : undefined;

module.exports = {
  baseUrl: isProd ? "/static" : "/",
  outputDir,
  pages: getPages([
    {
      name: "index",
      title: "xxx",
    },
    {
      name: "admin",
      title: "xxx",
    },
  ]),
  chainWebpack: (config) => {
    // 添加变更
    config.plugin("html-index").tap(appendHtmlWebpackOptions);
    config.plugin("html-admin").tap(appendHtmlWebpackOptions);

    // 添加别名
    const index = "./src/app/index";
    config.resolve.alias
      .set("index", resolve(index))
      .set("store", resolve(index, "store"))
      .set("router", resolve(index, "router"))
      .set("views", resolve(index, "views"))
      .set("components", resolve(index, "components"))
      .set("constant", resolve(index, "constant"))
      .set("assets", resolve(index, "assets"))
      .set("admin", resolve("./src/app/admin"));

    if (isProd) {
      /* 图片压缩 */
      config.module
        .rule("images")
        .use("image-webpack-loader")
        .loader("image-webpack-loader")
        .tap(() => {
          return {
            mozjpeg: {
              progressive: true,
              quality: 65,
            },
            // optipng.enabled: false will disable optipng
            optipng: {
              enabled: false,
            },
            pngquant: {
              quality: "65-90",
              speed: 4,
            },
          };
        });
    }
  },
  configureWebpack: (config) => {
    if (isProd) {
      return {
        plugins: [
          /* gzip压缩 */
          new CompressionPlugin({
            test: /\.js$|\.html$|.\css/, // 匹配文件名
            threshold: 10240, // 对超过10k的数据压缩
            deleteOriginalAssets: false, // 不删除源文件
          }),
          new LodashPlugin(),
        ],
      };
    }
  },
  devServer: {
    // public: 'xx.test.com',
    open: false,
    host: "0.0.0.0",
    disableHostCheck: true,
    proxy: {
      "/mock": {
        target: `http://127.0.0.1:3000`,
        changeOrigin: true,
        pathRewrite: {
          "^/mock": "",
        },
      },
      "/test": {
        target: `http://xxx.test.com`,
        changeOrigin: true,
        pathRewrite: {
          "^/test": "",
        },
      },
    },
    historyApiFallback: {
      rewrites: [{ from: /^\/admin/, to: "/admin.html" }],
    },
  },
  // node_modules依赖项es6语法未转换问题
  transpileDependencies: ["vuex-persist", "vue-echarts", "resize-detector"],
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "stylus",
      patterns: [
        path.resolve(__dirname, "./src/app/index/styles/common/index.styl"),
      ],
    },
  },

  runtimeCompiler: undefined,
  productionSourceMap: false,
  parallel: undefined,
  css: undefined,
  lintOnSave: undefined,
};
```

#### 19.例子 single-page

```js
const path = require("path");
const isProd = process.env.NODE_ENV === "production";

function resolve() {
  return path.join(__dirname, ...Array.from(arguments));
}

const outputDir =
  isProd && process.env.OUTPUT_DIR
    ? resolve(process.env.OUTPUT_DIR)
    : undefined;

module.exports = {
  publicPath: isProd ? "/static" : "/",
  outputDir,
  chainWebpack: (config) => {
    // 添加别名
    const index = "./src";
    config.resolve.alias
      .set("store", resolve(index, "store"))
      .set("router", resolve(index, "router"))
      .set("lib", resolve(index, "lib"))
      .set("views", resolve(index, "views"))
      .set("components", resolve(index, "components"))
      .set("constant", resolve(index, "constant"))
      .set("assets", resolve(index, "assets"))
      .set("layout", resolve(index, "layout"))
      .set("@", resolve(index));

    if (isProd) {
      /* 图片压缩 */
      config.module
        .rule("images")
        .use("image-webpack-loader")
        .loader("image-webpack-loader")
        .tap(() => {
          return {
            mozjpeg: {
              progressive: true,
              quality: 65,
            },
            // optipng.enabled: false will disable optipng
            optipng: {
              enabled: false,
            },
            pngquant: {
              quality: "65-90",
              speed: 4,
            },
          };
        });
    }
  },
  devServer: {
    open: false,
    host: "0.0.0.0",
    disableHostCheck: true,
    proxy: {
      "/api": {
        target: `http://api-test.cm.com`,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
  transpileDependencies: ["vuex-persist", "resize-detector"],
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [
        path.resolve(__dirname, "./src/assets/styles/common/index.scss"),
      ],
    },
  },

  runtimeCompiler: undefined,
  productionSourceMap: true,
  parallel: undefined,
  // css: undefined,
  lintOnSave: undefined,
};
```

## 其他
> vue cli 把 node_modules 文件也进行打包
```js
config.module
  .rule("compile")
  .test(/\.js$/)
  .include.add(resolve("node_modules/@assistant/todo/utils/index.js"))
  .end()
  .use("babel")
  .loader("babel-loader")
  .options({
    presets: [["@vue/cli-plugin-babel/preset"]],
  });
```

> [Vue CLi3](https://cli.vuejs.org/zh/config/#%E5%85%A8%E5%B1%80-cli-%E9%85%8D%E7%BD%AE) >[脚手架](https://github.com/ReliaMM/VueCliPreset)
