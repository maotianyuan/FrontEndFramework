let modules = []
const requireRouter = require.context('.', false, /\.js$/)
requireRouter.keys().map(fileName => {
  if (fileName === './index.js') return
  const route = requireRouter(fileName)
  modules.push(route.default || route)
})
export default modules