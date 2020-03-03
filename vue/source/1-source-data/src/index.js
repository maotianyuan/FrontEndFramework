import Vue from './vue'

let vm = new Vue({
  el: '#app',
  data: {
    title: 'title1',
    subTitle: 'subTitle2',
    test: {
      a: 1,
    },
    list: [1,10,100],
  },
})

setTimeout(()=> {
  // vm.title = 100
  // console.log(vm.test.a);
  // console.log(vm.test.a = 100);
  // console.log(vm.list)
  vm.list.push({listItem: '100'})
  vm.list[3].listItem = 10000
  // console.log(vm.list[3].listItem)
},200)