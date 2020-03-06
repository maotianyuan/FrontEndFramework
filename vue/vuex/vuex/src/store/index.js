import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [],
  state: {
    time: 1,
    userInfo: {
      avatar: '',
      account_name: '',
      name: ''
    },
  },
  getters: {
    getTime (state) {
      console.log('1212',state)
      return state.time
    }
  },
  mutations: {
    updateTime(state, payload){
      state.time = payload
    }
  },
  actions: {
    operateGrou({ commit }) {
      // commit('updateTime', 100)
      return Promise.resolve().then(()=>{
        return {
          rows: [1,2,3]
        }
      })
    }
  },
  modules: {
    report: {
      namespaced: false,
      state: {
        title: '',
      },
      getters: {
        getTitle (state) {
          return state.title
        }
      },
      mutations: {
        updateTitle(state, payload){
          state.title = payload
        }
      },
      actions: {
        operateGrou({ commit }) {
          commit('updateTitle', 100)
          return Promise.resolve().then(()=>{
            return {
              rows: [1,2,2,3]
            }
          })
        }
      },
      modules: {
        reportChild: {
          namespaced: false,
          state: {
            titleChild: '',
          },
          mutations: {
            updateTitle(state, payload){
              state.title = payload
            }
          },
          actions: {
            operateGrou({ commit }) {
              commit('updateTitle', 100)
              return Promise.resolve().then(()=>{
                return {
                  rows: [1,2,2,3]
                }
              })
            }
          },
        }
      }
    },
    part: {
      namespaced: false,
      state: {
        title: '',
      },
      mutations: {
        updateTitle(state, payload){
          state.title = payload
        },
        updateTitle1(state, payload){
          state.title = payload
        }
      },
      actions: {
        operateGrou({ commit }) {
          commit('updateTitle', 100)
          return Promise.resolve().then(()=>{
            return {
              rows: [1,2,2,3]
            }
          })
        }
      },
      modules: {
        partChild: {
          namespaced: false,
          state: {
            titleChild: '',
          },
          getters: {
            getTitleChild (state) {
              return state.titleChild
            }
          },
          mutations: {
            updateTitle(state, payload){
              state.titleChild = payload
            }
          },
          actions: {
            operateGrou({ commit }) {
              commit('updateTitle', 1000)
              return Promise.resolve().then(()=>{
                return {
                  rows: [1,2,2,3]
                }
              })
            }
          },
          modules: {
            partChildChild: {
              namespaced: false,
              state: {
                titleChild: '',
              },
              getters: {
                getTitleChild (state) {
                  return state.titleChild
                }
              },
              mutations: {
                updateTitle(state, payload){
                  state.titleChild = payload
                }
              },
              actions: {
                operateGrou({ commit }) {
                  commit('updateTitle', 1000)
                  return Promise.resolve().then(()=>{
                    return {
                      rows: [1,2,2,3]
                    }
                  })
                }
              },
            }
          }
        }
      }
    }
  }
})
