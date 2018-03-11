<template>
  <div class="header">
    <img src="./../../assets/logo.svg" alt="nodes " class="logo" width="200" height="40"/>
  </div>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style scoped>
.header {
  width: 100%;
  height: 50px;
  background: #1f1f21;
  color: #c8cbce;
  border-bottom: 1px solid #181819;
  -webkit-box-shadow: 0px 5px 10px 0px rgba(0,0,0,0.38);
  -moz-box-shadow: 0px 5px 10px 0px rgba(0,0,0,0.38);
  box-shadow: 0px 5px 10px 0px rgba(0,0,0,0.38);
  position: absolute;
  top: 0;
}
.logoPath {
  fill:#FFFFFF;
}

.logo {
  margin-top: 5px;
}
</style>
