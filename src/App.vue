<template>
  <div id="app">  
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <a class="navbar-brand">Projeto FK</a> 
      <router-link class="navbar-brand text-success" to="home">Home</router-link>
      <router-link class="navbar-brand text-success" to="users">Usuários</router-link>   
    </nav>    
    <div class="container">
      <router-view></router-view>
    </div>   
  </div>
</template>

<script>
  export default {
    mounted(){
      document.title = "Projeto FK - CRUD"
    },
    name: 'App',
    components: {
      
    }
  }
</script>

<style>
body {
  padding-top: 5%;
}
</style>
