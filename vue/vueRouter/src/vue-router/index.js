import install from './install'
import createMatcher from './create-matcher'
import HashHistory from './history/hash'

class Router {
  constructor(options) {
    this.matcher = createMatcher(options.routes)
    this.history = new HashHistory(this)
  }
  match(location){
    return this.matcher.match(location)
  }
  init (Vue) {
    this.history.transitionTo(
      this.history.getCurrentLocation(),
      ()=>{
        this.history.setupListener();
      }
    )
    this.history.listen((route)=>{ // 订阅好，等会路径属性一变化就执行此方法
      Vue._route = route
    })
  }
  push (location) {
    this.history.transitionTo(location, ()=>{
      window.location.hash = location
    })
  }
}

Router.install = install
export default Router


// install 模块单独放
  // beforCreate 中判断根子实例，添加根属性，添加完成之后，调用init
  // 若是根组件：保存当前实例放到, 实例属性 _routerRoot，实例_router 为用户参数 router，
  // 若非根组件：通过父子关系找到 _routerRoot，放到当前实例身上。保证每个实例有 routerRoot 根；
  
// router 处理 create-matcher 路由匹配器
  // 路由数据格式处理称 pathList pathMap
  // 数据处理可以在原来基础上添加
  // 返回 addRoute 方法
  // 返回 match 匹配所有路由集合方法

// history 上场，
  // 默认需要跳转到 /#/
  // 监听 hashchange 发生变化，transitionTo 获取到当前匹配的路由
  // 每当实例 beforeCreate 默认回调用获取当前匹配路由方法，在重新注册监听
    // transitionTo 跳转 // 父
    // getCurrentLocation 获取当前访问路径 // 子

// 匹配到当前路由，现在要做成响应式，供 vue 组件使用


// abc listen 
// 钩子函数
// beforeEach
// 文章