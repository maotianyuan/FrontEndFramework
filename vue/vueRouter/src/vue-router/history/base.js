export function createRoute (routes, location) {
  if (!routes) return { ...location, matched: [] }
  let res = []
  while(routes) {
    res.unshift(routes)
    routes = routes.parent
  }
  return {
    ...location,
    matched: res,
  }
}

class History {
  constructor (router) {
    this.router = router;
    this.current = createRoute(null,{
      path:'/'
    });
    console.log(this.current)
  }
  transitionTo (location, cb) {
    let r = this.router.match(location)
    if(location == this.current.path && r.matched.length == this.current.matched.length) {
      return;
    }
    console.log(r)
    this.current = r;
    this.cb && this.cb(r)
    cb && cb();
  }
  setupListener () {
    window.addEventListener('hashchange', () => {
      this.transitionTo(window.location.hash.slice(1));
    })
  }
  listen (cb) {
    this.cb = cb
  }
}
export default History