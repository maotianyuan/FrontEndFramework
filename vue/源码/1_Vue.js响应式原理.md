>[vue源码解读](https://github.com/answershuto/learnVue)
>[defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
#### Vue.js响应式原理

```js
function observe(value, cb) {
    Object.keys(value).forEach((key) => defineReactive(value, key, value[key] , cb))
}

function defineReactive (obj, key, val, cb) {
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: ()=>{
            /*....依赖收集等....*/
            /*Github:https://github.com/answershuto*/
            return val
        },
        set:newVal=> {
            val = newVal;
            cb();/*订阅者收到消息的回调*/
        }
    })
}

class Vue {
    constructor(options) {
        this._data = options.data;
        observe(this._data, options.render)
    }
}

let app = new Vue({
    el: '#app',
    data: {
        text: 'text',
        text2: 'text2'
    },
    render(){
        console.log("render");
    }
})


```

> 要对app._data.text操作才会触发set。为了偷懒，我们需要一种方便的方法通过app.text直接设置就能触发set对视图进行重绘。那么就需要用到代理。

```
_proxy.call(this, options.data);/*构造函数中*/

/*代理*/
function _proxy (data) {
    const that = this;
    Object.keys(data).forEach(key => {
        Object.defineProperty(that, key, {
            configurable: true,
            enumerable: true,
            get: function proxyGetter () {
                return that._data[key];
            },
            set: function proxySetter (val) {
                that._data[key] = val;
            }
        })
    });
}
```
