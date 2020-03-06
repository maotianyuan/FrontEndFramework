let Vue ;

let _modules = {}

function registerModule (state) {
  
}


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
          key = path.join('/').concat(item)
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
          key = path.join('/').concat(item)
        }
        this.actions[key] = this.actions[key] || []
        this.actions[key].push(actions[item])
      })
      const otherModules = data.modules || {}
      if (Object.keys(otherModules).length > 0){
        Object.keys(otherModules).map(item => {
          setAction(otherModules[item], path.concat(item))
        })
      }
    }
    setAction(options)

    let _state = options.state
    const setState = (data, path) => {
      if (path.length <= 0) {
        _state = options.state
      } else {
        let parentModule = path.slice(0, -1).reduce((next, prev)=>{
          return next[prev]
        }, _state)
        parentModule[path[path.length - 1]] = data.state
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
    console.log(_state)


    // Object.keys(options.getters || {}).map(item => {
    //   Object.defineProperty(this.getter, item, {
    //     get: function (){
    //       return options.state.getters[key](this.state)
    //     }
    //   })
    // })

  }
  get state () {
    return this.vm.state
  }
  dispatch = (acitonName, payload) => {
    this.actions[acitonName].map(fn => {
      fn(this, payload)
    })
  }
  commit = (mutationName, payload) => {
    this.mutations[mutationName].map(fn => {
      fn(this.state, payload)
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