class Events {
  constructor() {
    this._events = Object.create(null);
  }
  on(event, fn) {
    if (this._events["newListener"]) {
      this._events["newListener"].forEach((fn) => fn(event));
    }
    this._events[event] = this._events[event] || [];
    this._events[event].push(fn);
  }
  emit(event, ...args) {
    const fn = this._events[event];
    fn.map((item) => item(...args));
  }
  off(event, callback) {
    let fn = this._events[event];
    this._events[event] = fn.filter(
      (item) => item != callback && item.l != callback
    );
  }
  once(event, callback) {
    let one = (...args) => {
      callback(...args);
      this.off(event, one);
    };
    one.l = callback;
    this.on(event, one);
  }
}
module.exports = Events;
