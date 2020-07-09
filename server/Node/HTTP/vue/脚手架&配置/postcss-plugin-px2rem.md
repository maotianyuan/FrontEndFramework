## postcss-plugin-px2rem

### 目录
- 1: 安装依赖
- 2: index.html 加入mete适配
- 3: main.js
- 4: vue.config.js 配置
- 5: package.json 中加入postcss 相关插件

#### 1: 安装依赖
```
npm install px2rem-loader --save-dev
npm install lib-flexible --save
npm install postcss-plugin-px2rem --save-dev
```

#### 2: index.html 加入mete适配
```
<meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0,minimum=1.0,user-scalable=no">
```

#### 3: main.js
```js
// import 'lib-flexible' // 移动端适配 
import 'lib-flexible/flexible.js'
```

#### 4: vue.config.js 配置
```js
css: {
    loaderOptions: {
      css: {
        // options here will be passed to css-loader
      },
      postcss: {
        // options here will be passed to postcss-loader
        plugins: [require('postcss-plugin-px2rem')({
          rootValue: 37.5,
          minPixelValue: 3
          // propBlackList:['font-size']
        })]
      }
    }
  },
```

#### 5: package.json 中加入postcss 相关插件
```json
{
    "dependencies": { .. }
    "postcss": {
        "plugins": {
            "autoprefixer": {},
            "precss": {}
        }
    }
}
```

- rootValue (Number|Object) The root element font size. Default is 100.
  - If rootValue is an object, for example { px: 50, rpx: 100 }, it will replace rpx to 1/100 rem , and px to 1/50 rem.
- unitPrecision (Number) The decimal numbers to allow the REM units to grow to.
- propWhiteList (Array) The properties that can change from px to rem.
  - Default is an empty array that means disable the white list and enable all properties.
  - Values need to be exact matches.
- propBlackList (Array) The properties that should not change from px to rem.
  - Values need to be exact matches.
- exclude (Reg) a way to exclude some folder,eg. /(node_module)/.
- selectorBlackList (Array) The selectors to ignore and leave as px.
  - If value is string, it checks to see if selector contains the string.
    - ['body'] will match .body-class
  - If value is regexp, it checks to see if the selector matches the regexp.
    - [/^body$/] will match body but not .body
- ignoreIdentifier (Boolean/String) a way to have a single property ignored, when ignoreIdentifier enabled, then replace would be set to true automatically.
- replace (Boolean) replaces rules containing rems instead of adding fallbacks.
- mediaQuery (Boolean) Allow px to be converted in media queries.
- minPixelValue (Number) Set the minimum pixel value to replace.


[postcss-plugin-px2rem](https://www.npmjs.com/package/postcss-plugin-px2rem)

[vue-cli3.0 使用px2rem 或 postcss-plugin-px2rem](https://juejin.im/post/5c6e5112e51d457f7b6c5c91)