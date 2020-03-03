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
    console.log('inserValue',inserValue); // 新增值 响应
    if (inserValue) observeArray(inserValue);
    return arrayProto[item].call(this, value);
  }
})