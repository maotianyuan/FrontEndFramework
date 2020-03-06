let Vue ;

class Store{
  constructor (options) {
    this.vm = new Vue({
      data: {
        state: options.state
      }
    })
    this.getter = {}
    this.actions = {}
    this.mutations = {}

    const setMoutations = (data, path = []) => {
      const mutations = data.mutations
      const namespace = data.namespaced
      Object.keys(mutations).map(item => {
        let key = item
        if (namespace) {
          key = path.join('/').concat('/'+item)
        }
        this.mutations[key] = this.mutations[key] || []
        this.mutations[key].push(mutations[item])
      })
      const otherModules = data.modules || {}
      if (Object.keys(otherModules).length > 0){
        Object.keys(otherModules).map(item => {
          setMoutations(otherModules[item], path.concat(item))
        })
      }
    }
    setMoutations(options)

    const setAction = (data, path = []) => {
      const actions = data.actions
      const namespace = data.namespaced
      Object.keys(actions).map(item => {
        let key = item
        if (namespace) {
          key = path.join('/').concat('/'+item)
        }
        this.actions[key] = this.actions[key] || []
        // this.actions[key].push(actions[item])
        
        this.actions[key].push((payload) => { // 为什么要切片
          actions[item](this, payload); // 真正执行mutation的地方
        })
        console.log(this.actions[key])
      })
      const otherModules = data.modules || {}
      if (Object.keys(otherModules).length > 0){
        Object.keys(otherModules).map(item => {
          setAction(otherModules[item], path.concat(item))
        })
      }
    }
    setAction(options)

    const setState = (data, path) => {
      if (path.length > 0) {
        let parentModule = path.slice(0, -1).reduce((next, prev)=>{
          return next[prev]
        }, options.state)
        Vue.set(parentModule, path[path.length - 1], data.state);
      } 
      const otherModules = data.modules || {}
      if (Object.keys(otherModules).length > 0){
        Object.keys(otherModules).map(item => {
          setState(otherModules[item], path.concat(item))
        })
      }
    }

    setState(options, [])

    console.log(this.mutations)
    console.log(this.actions)
    console.log(this)


    const setGetter = (data, path = []) => {
      const getter = data.getters || {}
      const namespace = data.namespaced
      Object.keys(getter).map(item => {
        let key = item
        if (namespace) {
          key = path.join('/').concat('/'+item)
        }
        Object.defineProperty(this.getter, key, {
          get: () => {
            return getter[item](this.state)
          }
        })
      })

      const otherModules = data.modules || {}
      if (Object.keys(otherModules).length > 0){
        Object.keys(otherModules).map(item => {
          setGetter(otherModules[item], path.concat(item))
        })
      }

    }
    setGetter(options)


    if(this.strict){
      this.vm.$watch(()=>{
          return this.vm.state
      },function () {
          console.assert(this._committing,'不能异步调用')
      },{deep:true,sync:true});
    } 
  }
  get state () {
    return this.vm.state
  }
  _withCommit(fn){
    const committing = this._committing; // 保留false
    this._committing = true; // 默认调用mutation之前会先 更改值是true
    fn();
    this._committing = committing
  }
  dispatch = (acitonName, payload) => {
    this.actions[acitonName].map(fn => {
      fn(payload)
    })
  }
  commit = (mutationName, payload) => {
    console.log('1212',mutationName)
    this._withCommit(()=>{
      this.mutations[mutationName] && this.mutations[mutationName].map(fn => {
        fn(this.state, payload)
      })
    })
  }
}

const install = (_Vue) => {
  Vue = _Vue
  Vue.mixin({
    beforeCreate(){
      if(this.$options.store) {
        this.$store = this.$options.store
      } else {
        this.$store = this.$parent && this.$parent.$store
      }
    }
  })
}

export default {
  install,
  Store
}