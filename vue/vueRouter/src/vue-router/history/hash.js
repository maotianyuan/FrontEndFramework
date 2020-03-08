import History from './base'


function ensureSlash() {
  if(window.location.hash){ // ff 不兼容 window.location.href
      return 
  }
  window.location.hash = '/'
}


class HashHistory extends History{
  constructor (router) {
    super(router)
    this.router = router;
    ensureSlash()
  }
  getCurrentLocation () {
    return window.location.hash.slice(1)
  }
}
export default HashHistory