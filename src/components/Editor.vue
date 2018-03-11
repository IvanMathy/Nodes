<template>
  <div class="container">
    <div class="background">
      <Canvas/>
    </div>
    <div class="playground">
      <Node v-for="node in nodes" :key="node.id" :node="node"/>
    </div>
    <NodePicker v-show="isPickerVisible" :isVisible="isPickerVisible"/>
  </div>
</template>

<script>

import Canvas from './elements/Canvas.vue'
import Node from './elements/Node.vue'
import NodePicker from './elements/NodePicker.vue'
import { mapState } from 'vuex'

export default {
  name: 'Editor',
  data () {
    return {
      isPickerVisible: false
    }
  },
  components: {
    Canvas,
    Node,
    NodePicker
  },
  computed: mapState([
    'nodes',
    'offset'
  ]),
  mounted: function () {
    var vm = this
    window.addEventListener('keyup', function (e) {
      if ((e.which || e.keyCode) === 32) {
        vm.isPickerVisible = !vm.isPickerVisible
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  z-index: 1;
  margin-top: 40px;
}
.playground {
  position: absolute;
}
.background {
  position: absolute;
}
</style>
