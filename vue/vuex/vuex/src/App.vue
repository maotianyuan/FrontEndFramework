<template>
  <div id="app">
    time: {{$store.state.time}}
    time: {{$store.state.part.partChild.titleChild}}
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  created(){
    console.log(this)
    this.$store.dispatch('part/partChild/operateGrou')
  }
}
/**
 * 
 * state 结构生成
 * 
 * _actions = [ 数组结构生成
 *  operateGrou, 回调函数
 * 
 * ]
 * _mutations = [ 结构生成
 *    updateTime 
 * ]
 * 
 * _modules = { 结构生成
 *  root: {
 *     state: 
 *    _rawModule: 用户传入
 *    _children: {}
 *  }
 * }
 */
</script>
