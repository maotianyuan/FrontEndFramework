
import { arrayMethods, observeArray, dependArray } from './array'
import Dep from './dep'

export default function observe (value) {
  if (typeof value != 'object' || value == null ) return ;
  return new Observe(value)
}

function defineProperty (obj, key, value) {
  let childOb = observe(value);
  let dep = new Dep()
  Object.defineProperty(obj, key, {
    get: function() {
      dep.depend()
      if(childOb){ //**  数组的依赖收集  [[1],2,3]
        childOb.dep.depend(); // 数组也收集了当前渲染watcher
        dependArray(value); // 收集儿子的依赖
      }
      return value;
    },
    set: function(newVal){
      if (newVal === value) return;
      value = newVal;
      dep.notify()
      observe(newVal)
      return value;
    }
  })
}

export class Observe {
  constructor (value) {
    this.dep = new Dep();
    Object.defineProperty(value, '__obj__', {
      get: ()=>this
    })
    if (Array.isArray(value)) {
      value.__proto__ = arrayMethods;
      observeArray(value);
    }else {
      this.walk(value);
    }
  }
  walk(obj) {
    Object.keys(obj).map(item => {
      defineProperty(obj, item, obj[item])
    })
  }
}