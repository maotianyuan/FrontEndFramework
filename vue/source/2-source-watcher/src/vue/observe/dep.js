var id = 0;
class Dep {
  constructor () {
    this._id = id++
    this.subs = [];
  }
  addSub (watcher) {
    this.subs.push(watcher)
  }
  depend () {
    Dep.target && Dep.target.addDep(this)
  }
  notify () {
    this.subs.map(watcher => watcher.update())
  }
}

Dep.target = null;

let stack = [];
export function pushTarget(watcher){
    Dep.target = watcher;
    stack.push(watcher);
}
export function popTarget(){
    stack.pop();
    Dep.target = stack[stack.length-1];
}

export default Dep