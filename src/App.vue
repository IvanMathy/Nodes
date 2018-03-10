<template>
  <div id="app">
    <router-view/>
    <Header/>
  </div>
</template>

<script>
import Header from './components/elements/header.vue'
export default {
  name: 'App',
  components: {
    Header
  }
}
</script>

<style>
html {
  box-sizing: border-box;
  font-size: 16px;
  background-color: #262728;
}

body, html {
  height: 100%;
}

*, *:before, *:after {
  box-sizing: inherit;
}

body, h1, h2, h3, h4, h5, h6, p, ol, ul {
  margin: 0;
  padding: 0;
  font-weight: normal;
}

ol, ul {
  list-style: none;
}

img {
  max-width: 100%;
  height: auto;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  position: relative;
}
</style>
