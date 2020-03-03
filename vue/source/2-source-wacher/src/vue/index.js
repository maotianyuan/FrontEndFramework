import initState from './observe'
import Watcher from './observe/Watcher'

function Vue (options) {
  this._init(options)
}
Vue.prototype._init = function(options) {
  let vm = this;
  vm.$options = options
  initState(vm);
  if(vm.$options.el){
    vm.$mount();
  }
}

Vue.prototype._update = function () {
  // 用用户传入的数据 去更新视图
  let vm = this;
  let el = vm.$el;
  let node = document.createDocumentFragment();
  let firstChild;
  while(firstChild = el.firstChild){ // 每次拿到第一个元素就将这个元素放入到文档碎片中
      node.appendChild(firstChild); // appendChild 是具有移动的功能 
  }
  compiler(node,vm);
  el.appendChild(node);
}

function query(el){
  if(typeof el === 'string'){
      return document.querySelector(el);
  }
  return el
}
Vue.prototype.$mount = function () {
  let vm = this;
  let el = vm.$options.el
  el = vm.$el = query(el) 
  console.log(vm)
  function updateComponent(){
    console.log('update 渲染页面')
    vm._update(); 
  }
  new Watcher(vm, updateComponent)
}
export default Vue;{}



const defaultRE = /\{\{((?:.|\r?\n)+?)\}\}/g
export const util = {
    getValue(vm,expr){
        let keys = expr.split('.');
        return keys.reduce((memo,current)=>{
            memo = memo[current];
            return memo
        },vm);
    },
    compilerText(node,vm){
        if(!node.expr){
            node.expr = node.textContent;
        }
        node.textContent = node.expr.replace(defaultRE,function (...args) {
            return util.getValue(vm,args[1]); 
        });
    }
}
export function compiler(node,vm){ // node 就是文档碎片 
    let childNodes = node.childNodes; // 只有第一层 只有儿子 没有孙子
    // 将类数组转化成数组
    [...childNodes].forEach(child=>{ 
        if(child.nodeType == 1){ //1 元素
            compiler(child,vm); // 编译当前元素的孩子节点
        }else if(child.nodeType == 3){  // 3 文本
            util.compilerText(child,vm);
        }
    });
}