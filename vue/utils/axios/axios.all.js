import axios from 'axios'
const AxiosAllSpread = {}

export function axiosAllSpread ({ postList = [], params = {}, type = [] }) {
  let reqList = []
  postList.map((item, index) => {
    let req = axios[type[index] ? 'get' : 'post'](item, { ...params }).catch((data) => {
      return {
        data: {
          data: {},
          errorcode: 1,
          message: false
        }
      }
    })
    reqList.push(req)
  })
  return axios.all(reqList).then(axios.spread(function (...resList) {
    return resList
  }))
}

AxiosAllSpread.install = (Vue) => {
  Vue.prototype.$axiosAllSpread = axiosAllSpread
}

export default AxiosAllSpread
