
import { arrayMethods, observeArray } from './array.js'

export default function observe (value) {
  if (typeof value != 'object') return value;
  return new Observe(value)
}

function defineProperty (obj, key, value) {
  observe(value);
  Object.defineProperty(obj, key, {
    get: function() {
      console.log(`获取值 ${key} `)
      return value;
    },
    set: function(newVal){
      if (newVal === value) return;
      value = newVal;
      console.log(`修改值 ${key} 为 ${newVal}`)
      observe(newVal)
      return value;
      // update()
    }
  })
}

export class Observe {
  constructor (value) {
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