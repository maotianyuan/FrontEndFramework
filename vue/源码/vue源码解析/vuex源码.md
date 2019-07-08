## 目录
- 零、前提
- 一、Vue定义的 Vue.use 和 install方法
- 二、插件install方法
- 三、vuexInit() 
- 四、Vue.mixin()
- 五、Store实例

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


### 五、Store实例
>上面我们讲到了 vuexInit 会从 options 中获取 Store。所以接下来会讲到 Store 是怎么来的呢？

>我们把 Store 的实例化过程拆成 3 个部分，分别是初始化模块，安装模块和初始化 store._vm，接下来我们来分析这 3 部分的实现。

>不要在发布环境下启用严格模式。严格模式会深度监测状态树来检测不合规的状态变更 —— 请确保在发布环境下关闭严格模式，以避免性能损失。

> 三个模块
- 初始化模块
- 安装模块
- store._vm

- 5.1初始化模块
>首先根据path获取父模块，然后调取父模块addChild建立父子关系，递归执行这样的过程
```js
import Module from './module'
import { assert, forEachValue } from '../util'

export default class ModuleCollection {
  constructor (rawRootModule) {
    // register root module (Vuex.Store options)
    this.register([], rawRootModule, false)
  }

  get (path) {
    return path.reduce((module, key) => {
      return module.getChild(key)
    }, this.root)
  }

  getNamespace (path) {
    let module = this.root
    return path.reduce((namespace, key) => {
      module = module.getChild(key)
      return namespace + (module.namespaced ? key + '/' : '')
    }, '')
  }

  update (rawRootModule) {
    update([], this.root, rawRootModule)
  }

  register (path, rawModule, runtime = true) {
    if (process.env.NODE_ENV !== 'production') {
      assertRawModule(path, rawModule)
    }

    const newModule = new Module(rawModule, runtime)  // 创建一个Module实例，是用来描述单模块类
    if (path.length === 0) {
      this.root = newModule
    } else {
      const parent = this.get(path.slice(0, -1))
      parent.addChild(path[path.length - 1], newModule)
    }

    // register nested modules
    if (rawModule.modules) {
      forEachValue(rawModule.modules, (rawChildModule, key) => {
        this.register(path.concat(key), rawChildModule, runtime)
      })
    }
  }

  unregister (path) {
    const parent = this.get(path.slice(0, -1))
    const key = path[path.length - 1]
    if (!parent.getChild(key).runtime) return

    parent.removeChild(key)
  }
}

function update (path, targetModule, newModule) {
  if (process.env.NODE_ENV !== 'production') {
    assertRawModule(path, newModule)
  }

  // update target module
  targetModule.update(newModule)

  // update nested modules
  if (newModule.modules) {
    for (const key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            `[vuex] trying to add a new module '${key}' on hot reloading, ` +
            'manual reload is needed'
          )
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      )
    }
  }
}

const functionAssert = {
  assert: value => typeof value === 'function',
  expected: 'function'
}

const objectAssert = {
  assert: value => typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'),
  expected: 'function or object with "handler" function'
}

const assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
}

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(key => {
    if (!rawModule[key]) return

    const assertOptions = assertTypes[key]

    forEachValue(rawModule[key], (value, type) => {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      )
    })
  })
}

function makeAssertionMessage (path, key, type, value, expected) {
  let buf = `${key} should be ${expected} but "${key}.${type}"`
  if (path.length > 0) {
    buf += ` in module "${path.join('.')}"`
  }
  buf += ` is ${JSON.stringify(value)}.`
  return buf
}
```

- 5.2安装模块
> 初始化模块后，执行安装模块的相关逻辑，
initModule(this, state, [], this._modules.root)

```js
function installModule (store, rootState, path, module, hot) {
  const isRoot = !path.length
  const namespace = store._modules.getNamespace(path)

  // register in namespace map
  if (module.namespaced) { // 有命名空间则：dispath('account/login')
    if (store._modulesNamespaceMap[namespace] && process.env.NODE_ENV !== 'production') {
      console.error(`[vuex] duplicate namespace ${namespace} for the namespaced module ${path.join('/')}`)
    }
    store._modulesNamespaceMap[namespace] = module
  }

  // set state
  if (!isRoot && !hot) {
    const parentState = getNestedState(rootState, path.slice(0, -1))
    const moduleName = path[path.length - 1]
    store._withCommit(() => {
      Vue.set(parentState, moduleName, module.state)
    })
  }

  const local = module.context = makeLocalContext(store, namespace, path)

  module.forEachMutation((mutation, key) => {
    const namespacedType = namespace + key
    registerMutation(store, namespacedType, mutation, local)
  })

  module.forEachAction((action, key) => {
    const type = action.root ? key : namespace + key
    const handler = action.handler || action
    registerAction(store, type, handler, local)
  })

  module.forEachGetter((getter, key) => {
    const namespacedType = namespace + key
    registerGetter(store, namespacedType, getter, local)
  })

  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child, hot)
  })
}
```


### util
```js
/**
 * forEach for object
 */
export function forEachValue (obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}

export function partial (fn, arg) {
  return function () {
    return fn(arg)
  }
}

forEachValue(wrappedGetters, (fn, key) => {
// use computed to leverage its lazy-caching mechanism
// direct inline function use will lead to closure preserving oldVm.
// using partial to return function with only arguments preserved in closure enviroment.
  computed[key] = partial(fn, store)
  Object.defineProperty(store.getters, key, {
    get: () => store._vm[key],
    enumerable: true // for local getters
  })
}
```
>当我根据 key 访问 store.getters 的某一个 getter 的时候，实际上就是访问了 store._vm[key]，也就是 computed[key]，在执行 computed[key] 对应的函数的时候，会执行 rawGetter(local.state,...) 方法，那么就会访问到 store.state，进而访问到 store._vm._data.$$state，这样就建立了一个依赖关系。当 store.state 发生变化的时候，下一次再访问 store.getters 的时候会重新计算。

[GitHub - VUE](https://github.com/answershuto/learnVue)
[GitHub - VUE](https://github.com/answershuto/learnVue/tree/master/vue-src)
[GitHub - VUEX](https://github.com/vuejs/vuex)
[GitHub - VUEX](https://github.com/answershuto/learnVue/tree/master/vuex-src)