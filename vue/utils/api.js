const files = require.context('./views', true, /server\.js$/)
const api = {}
files.keys().map(item => {
  let file = files(item)
  let arr = item.split('/')
  const target = arr.slice(1, arr.length - 1)
  target.reduce((next, prev, index) => {
    index >= target.length - 1 ? next[prev] = file : next[prev] = Object.assign({}, next[prev])
    return next
  }, api)
})
