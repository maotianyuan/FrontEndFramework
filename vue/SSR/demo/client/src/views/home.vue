<template>
    <div >
      首页
      stateTitle
      <div :key="item" v-for="item in $store.state.list">{{item}}</div>
    </div>
</template>
<script>
export default {
  asyncData (store) {
    return store.dispatch('getNewList')
  },
  mounted () {
    console.log('mounted')
    this.$store.dispatch('getNewList')
  }
}
</script>