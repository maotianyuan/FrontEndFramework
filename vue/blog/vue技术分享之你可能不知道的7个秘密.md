### vue技术分享之你可能不知道的7个秘密

### 目录
- 一、善用watch的immediate属性
- 二、组件注册，值得借鉴
- 三、精简vuex的modules引入
- 四、路由的延迟加载
- 五、router key组件刷新
- 六、唯一组件根元素
- 七、组件包装、事件属性穿透问题


### 一、善用watch的immediate属性
- bad
```js
created(){
  this.fetchPostList()
},
watch: {
  searchInputValue(){
    this.fetchPostList()
  }
}
```
- good
```js
watch: {
  searchInputValue:{
    handler: 'fetchPostList',
    immediate: true
  }
}
```

### 二、组件注册，值得借鉴
- bad
```js
import BaseButton from './baseButton'
import BaseIcon from './baseIcon'
import BaseInput from './baseInput'
 
export default {
 components: {
  BaseButton,
  BaseIcon,
  BaseInput
 }
}
<BaseInput v-model="searchText" @keydown.enter="search" />
<BaseButton @click="search" /><BaseIcon name="search"/></BaseButton>
```

- good
```js
import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
 
// Require in a base component context
const requireComponent = require.context(
 ‘./components', false, /base-[\w-]+\.vue$/
)
 
requireComponent.keys().forEach(fileName => {
 // Get component config
 const componentConfig = requireComponent(fileName)
 
 // Get PascalCase name of component
 const componentName = upperFirst(
  camelCase(fileName.replace(/^\.\//, '').replace(/\.\w+$/, ''))
 )
 
 // Register component globally
 Vue.component(componentName, componentConfig.default || componentConfig)
})
```
```js
<BaseInput
 v-model="searchText"
 @keydown.enter="search"
/>
<BaseButton @click="search" /><BaseIcon name="search"/> </BaseButton>
```

- good例子
```js
export default {
  install (Vue) {
    const context = require.context('../components/global', true, /index\.(vue|js)/)
    for (let key of context.keys()) {
      const component = context(key).default
      Vue.component(component.name, component)
    }
  }
}
```

### 三、精简vuex的modules引入
- old
```js
import auth from './modules/auth'
import posts from './modules/posts'
import comments from './modules/comments'
// ...
 
export default new Vuex.Store({
 modules: {
  auth,
  posts,
  comments,
  // ...
 }
})
```
- good
```js
import camelCase from 'lodash/camelCase'
const requireModule = require.context('.', false, /\.js$/)
const modules = {}
requireModule.keys().forEach(fileName => {
 // Don't register this file as a Vuex module
 if (fileName === './index.js') return
 
 const moduleName = camelCase(
  fileName.replace(/(\.\/|\.js)/g, '')
 )
 modules[moduleName] = {
   namespaced: true,
   ...requireModule(fileName),
   }
})
export default modules
```
这样我们只需如下代码就可以了
```js
import modules from './modules'
export default new Vuex.Store({
 modules
})
```

- good 实例2
```js 
const modules = context.keys().reduce((modules, filePath) => {
  const paths = filePath.replace(/^\.\/(.+)\.js$/, '$1').split(/\//)
  const fileName = paths.pop()
  let last = modules
  while (paths.length > 0) {
    const k = paths.shift()
    last = last[k] = last[k] || {}
  }
  last[fileName] = context(filePath).default
  return modules
}, {})
```

### 四、路由的延迟加载
- good
```js
{
 path: '/admin',
 name: 'admin-dashboard',
 component:require('@views/admin').default
}
//  or
{
 path: '/admin',
 name: 'admin-dashboard',
 component:() => import('@views/admin')
}
```

### 五、router key组件刷新
面这个场景真的是伤透了很多程序员的心...先默认大家用的是Vue-router来实现路由的控制。 假设我们在写一个博客网站，需求是从/post-haorooms/a，跳转到/post-haorooms/b。然后我们惊人的发现，页面跳转后数据竟然没更新？！原因是vue-router"智能地"发现这是同一个组件，然后它就决定要复用这个组件，所以你在created函数里写的方法压根就没执行。通常的解决方案是监听$route的变化来初始化数据，如下：
```js
data() {
 return {
  loading: false,
  error: null,
  post: null
 }
}, 
watch: {
 '$route': {
  handler: 'resetData',
  immediate: true
 }
},
methods: {
 resetData() {
  this.loading = false
  this.error = null
  this.post = null
  this.getPost(this.$route.params.id)
 },
 getPost(id){
 
 }
}
```
bug是解决了，可每次这么写也太不优雅了吧？秉持着能偷懒则偷懒的原则，我们希望代码这样写：
```js
data() {
 return {
  loading: false,
  error: null,
  post: null
 }
},
created () {
 this.getPost(this.$route.params.id)
},
methods () {
 getPost(postId) {
  // ...
 }
}
```
解决方案：给router-view添加一个唯一的key，这样即使是公用组件，只要url变化了，就一定会重新创建这个组件。
```js
<router-view :key="$route.fullpath"></router-view>
```

注：个人经验，这个一般应用在子路由里面，这样才可以不避免大量重绘，假设app.vue根目录添加这个属性，那么每次点击改变地址都会重绘，还是得不偿失的！

### 六、唯一组件根元素
- error
模板中div只能有一个，不能如上面那么平行2个div。
```js
<template>
 <li
  v-for="route in routes"
  :key="route.name"
 >
  <router-link :to="route">
   {{ route.title }}
  </router-link>
 </li>
</template>
```
我们可以用render函数来渲染
```js
functional: true,
render(h, { props }) {
 return props.routes.map(route =>
  <li key={route.name}>
   <router-link to={route}>
    {route.title}
   </router-link>
  </li>
 )
}
```
### 七、组件包装、事件属性穿透问题
```js
//父组件
<BaseInput 
  :value="value"
  label="密码"
  placeholder="请填写密码"
  @input="handleInput"
  @focus="handleFocus>
</BaseInput>
 
//子组件
<template>
 <label>
  {{ label }}
  <input
   :value="value"
   :placeholder="placeholder"
   @focus=$emit('focus', $event)"
   @input="$emit('input', $event.target.value)"
  >
 </label>
</template>
```

```js
<input
  :value="value"
  v-bind="$attrs"
  v-on="listeners"
>
 
computed: {
 listeners() {
  return {
   ...this.$listeners,
   input: event => 
    this.$emit('input', event.target.value)
  }
 }
}
```
$attrs包含了父作用域中不作为 prop 被识别 (且获取) 的特性绑定 (class 和 style 除外)。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定，并且可以通过 v-bind="$attrs" 传入内部组件。
$listeners包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件。