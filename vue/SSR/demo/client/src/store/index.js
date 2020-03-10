import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default () => {
  let store = new Vuex.Store({
    state: {
      list: [],
    },
    mutations: {
      updateNewList (state, payload) {
        state.list = payload
      }
    },
    actions: {
      getNewList({commit}) {
        return new Promise(( resolve )=>{
          const newList = ['新闻1', '新闻2', '新闻3']
          setTimeout(()=>{
            commit('updateNewList', newList)  
            resolve()
          },5000)
          
        })
      }
    }
  })
  if(typeof window !== "undefined"){
    if(window.__INITIAL_STATE__){
        store.replaceState(window.__INITIAL_STATE__)
    }
  }
  return store;
}