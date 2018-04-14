<template>
  <div class="help">
    <div class="window">
      <h2>Howdy.</h2>
      <p>Welcome to Nodes, a Vue.js node picker sample project. </p>
      <div class="instructions">
        <p><img src="./../../assets/example.svg" alt="example" width="260"/></p>
        <p><span>SPACE</span> opens the node picker</p>
        <p><span>CLICK AND DRAG</span> an output to connect</p>
        <p><span>RIGHT CLICK</span> an input to disconnect it</p>
        <p><span>DOUBLE CLICK</span> a node to minify it</p>
      </div>

      <div class="closeButton" @click="$emit('close')"> GOTCHA </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Help',
  data () {
    return {}
  }
}
</script>

<style scoped>
.help {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #040505CC;
}

.help .window {
  background-color: #303133;
  width: 615px;
  border-radius: 10px;
  color: white;
  position: absolute;
  padding-top: 10px;
  padding-bottom: 10px;
  top: 50%;
  left: 50%;

  margin: -150px 0 0 -300px;
}

.instructions {
   column-count: 2;
   margin-top: 10px;
   background-color: #535659;
   padding: 10px;
   padding-top: 15px;
}

.instructions p {
  margin-bottom: 10px;
  text-align: left;
}
.instructions span {
  padding: 2px 4px;
  font-weight: bold;
  font-size: 80%;
  border-radius: 5px;
  background: #171819;
}
.closeButton {
  display: inline-block;
  padding: 8px 15px;
  margin: auto;
  margin-top: 15px;
  background-color: #0cb2ff;
  border-radius: 5px;
  color: white;
  font-weight: 900;
  cursor: pointer;
}
</style>
