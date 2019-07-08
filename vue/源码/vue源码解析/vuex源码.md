## 目录
- 零、前提
- 一、Vue定义的 Vue.use 和 install方法
- 二、插件install方法
- 三、vuexInit() 
- 四、Vue.mixin()
- 五、Store

### 零、前提
> 当你开始读源码的时候，相信已经对Vuex有很熟练的应用，对Vue也是灵活运用了；

### 一、Vue定义的 Vue.use 和 install方法
>我们在安装插件的时候，总会像下面一样用 Vue.use() 来载入插件，可是 Vue.use() 做了什么呢？

>Vue 源码在 initGlobalAPI 入口方法中调用了 initUse (Vue) 方法，这个方法定义了 Vue.use() 需要做的内容。

>安装 Vue.js 插件。如果插件是一个对象，必须提供 install 方法。如果插件是一个函数，它会被作为 install 方法。install 方法调用时，会将 Vue 作为参数传入。

- 如下代码，vue中声明插件的install方法
这段代码主要做的事情：一件是防止重复安装相同的 plugin，另一件是初始化 plugin
```js
function initGlobalAPI (Vue) {
  ......
  initUse(Vue);
  initMixin$1(Vue); 
  ......
}

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    /* 判断过这个插件是否已经安装 */
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }
    var args = toArray(arguments, 1);
    args.unshift(this);
    /* 判断插件是否有 install 方法 */
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}
```
看完以上源码，我们知道插件（Vuex）需要提供一个 install 方法。那么我们看看 Vuex 源码中是否有这个方法。结果当然是有的：

---

### 二、插件install方法
- Vuex 也同样存在一个静态的 install 方法
```js
export function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  Vue = _Vue
  /* 将 vuexInit 混淆进 Vue 的 beforeCreate(Vue2.0) 或 _init 方法(Vue1.0) */
  applyMixin(Vue)
}
```

---

### 三、vuexInit() 

- applyMixin
>它其实就全局混入了一个 beforeCreate 钩子函数，它的实现非常简单，就是把 options.store 保存在所有组件的 this.$store 中，这个 options.store 就是我们在实例化 Store 对象的实例，
```js 
export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])
  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * 通过这步的操作，我们就以在任意一个 vm 中通过 this.$store 来访问 Store 的实例。
   */

  function vuexInit () {
    const options = this.$options
     /* 根节点存在 stroe 时 */
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      /* 子组件直接从父组件中获取 $store，这样就保证了所有组件都公用了全局的同一份 store*/
      this.$store = options.parent.$store
    }
  }
}
```

---

### 四、Vue.mixin()
>全局注册一个混入，影响注册之后所有创建的每个 Vue 实例。插件作者可以使用混入，向组件注入自定义的行为。不推荐在应用代码中使用。

```js
function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}
```


### 五、Store
>上面我们讲到了 vuexInit 会从 options 中获取 Store。所以接下来会讲到 Store 是怎么来的呢？

>我们把 Store 的实例化过程拆成 3 个部分，分别是初始化模块，安装模块和初始化 store._vm，接下来我们来分析这 3 部分的实现。

>不要在发布环境下启用严格模式。严格模式会深度监测状态树来检测不合规的状态变更 —— 请确保在发布环境下关闭严格模式，以避免性能损失。

--- 待续

