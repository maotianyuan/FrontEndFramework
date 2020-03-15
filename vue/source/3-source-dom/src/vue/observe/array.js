import observe from './observe'

let arrayProto = Array.prototype;

const methods = [
  'push',
  'pop',
  'unshift',
  'shift',
  'sort',
  'reverse',
  'splice',
]
const isType = (type) => (value) => Object.prototype.toString.call(value) === `[object ${type}]`
const isObject = isType('Object')
const isArray = isType('Array')

export function observeArray (value) {
  if (isObject(value)) {
    observe(value)
    return;
  }
  if (isArray(value)) {
    value.map(i => observe(i))
  }
 }
 
 export function dependArray(value){ // 递归收集数组中的依赖
  for(let i = 0; i < value.length;i++){
      let currentItem = value[i]; // 有可能也是一个数组 arr: [[[[[]]]]]
      currentItem.__ob__ && currentItem.__ob__.dep.depend();
      if(Array.isArray(currentItem)){
          dependArray(currentItem); // 不停的手机 数组中的依赖关系
      }
  }
}

export let arrayMethods = Object.create(arrayProto)

methods.map(item => {
  arrayMethods[item] = function (value) {
    let inserValue;
    switch (item) {
      case 'push':
      case 'unshift':
        inserValue = value
      break;
      case 'splice':
        inserValue = value.slice(2);
      break;
    }
    // console.log('inserValue',inserValue); // 新增值 响应
    if (inserValue) observeArray(inserValue);
    console.log('arrayThis',this)
    this.__obj__.dep.notify()
    return arrayProto[item].call(this, value);
  }
})