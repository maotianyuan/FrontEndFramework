var id = 0;
import {pushTarget,popTarget} from './dep'

class Watcher {
  constructor (vm, exprOrFn, cb = () =>{}, opts = {}) {
    this.vm = vm;
    this._id = id++
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    } else {
      this.getter = () => exprOrFn
    }
    this.cb = cb;
    this.opts = opts
    this.depsId = new Set()
    this.deps = []
    this.get()
  }
  get() {
    pushTarget(this);
    this.getter()
    popTarget();
  }
  run () {
    this.get();
  }
  update(){ // 如果立即调用get 会导致页面刷新 异步来更新
    queueWatcher(this);
  }
  addDep(dep) {
    let id = dep._id
    if(!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this);
    }
  }
}
let has = {};
let queue = [];

function flushQueue(){
  queue.forEach(watcher=>watcher.run())
  has = {}
  queue = []
}
function queueWatcher(watcher){
  let id = watcher._id
  if(has[id] == null){
      has[id] = true;
      queue.push(watcher)
      nextTick(flushQueue)
  }
}

let callbacks = [];

function nextTick(cb){ // cb就是flushQueue
    
    callbacks.push(cb);
    
    let timerFunc = ()=>{
      callbacks.forEach(cb=>cb());
    }
    if(Promise){
        return Promise.resolve().then(timerFunc)
    }
    if(MutationObserver){ // MutationObserver 也是一个异步方法
        let observe = new MutationObserver(timerFunc); // H5的api
        let textNode = document.createTextNode(1);
        observe.observe(textNode,{characterData:true});
        textNode.textContent = 2;
        return
    }
    if(setImmediate){
        return setImmediate(timerFunc)
    }
    setTimeout(timerFunc, 0);
}
// 等待页面更新再去获取dom元素

export default Watcher