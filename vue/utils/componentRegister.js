import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const baseComponents = {
  install (Vue) {
    const requireComponents = require.context('../components/global', true, /\.(vue|js)/)
    requireComponents.keys().map(fileName => {
      const componentConfig = requireComponents(fileName)
      const componentName = upperFirst(
        camelCase(fileName.replace(/^\.\//, '').replace(/\.\w+$/, ''))
      )
      Vue.component(componentName, componentConfig.default || componentConfig)
    })
  }
}
Vue.use(baseComponents)
