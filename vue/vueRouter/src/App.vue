<template>
  <div id="app">
    <router-link to="/login">登陆</router-link><br/>
    <router-link to="/list">列表</router-link><br/>
    <router-link to="/list/a">列表a</router-link><br/>
    <router-link to="/list/a/a1">列表a1</router-link><br/>

    <br/>
    <p>----</p>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  created(){
    console.log(this)
  }
}
</script>
<style>
a {
  color: blue;
}
</style>
