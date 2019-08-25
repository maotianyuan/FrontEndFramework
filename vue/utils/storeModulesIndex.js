import camelCase from 'lodash/camelCase'
const requireModule = require.context('.', false, /\.js$/)
const modules = {}
requireModule.keys().forEach(fileName => {
  if (fileName === './index.js') return
  const componentConfig = requireModule(fileName)
  const moduleName = camelCase(
    fileName.replace(/(\.\/|\.js)/g, '')
  )
  modules[moduleName] = {
    namespaced: true,
    ...componentConfig.default || componentConfig
  }
})
export default modules
