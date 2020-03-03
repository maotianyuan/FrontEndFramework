import Vue from './vue'

let vm = new Vue({
  el: document.getElementById('app'), 
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
  // vm.title = 101
  // vm.title = 12
  // vm.title = 1
  vm.list.push(100)
  // console.log(vm.title)
  // console.log(vm.subTitle)
  // console.log(vm.test.a);
  // console.log(vm.test.a = 100);
  // console.log(vm.list)
  // vm.title = '1'
  // vm.title = '2'
},200)