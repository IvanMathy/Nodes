<template>
  <div class="container">
    <div class="background">
      <Canvas :offset="offset" :nodes="nodes" :linkCreation="linkCreation"/>
    </div>
    <div class="playground">
      <Node v-for="node in nodes" :key="node.id" v-bind:node="node" :offset="offset" :delete="deleteNode"/>
    </div>
    <NodePicker v-show="isPickerVisible" :isVisible="isPickerVisible"/>
  </div>
</template>

<script>

import Canvas from './elements/Canvas.vue'
import Node from './elements/Node.vue'
import NodePicker from './elements/NodePicker.vue'

export default {
  name: 'Editor',
  data () {
    return {
      nodes: [],
      offset: { x: 0, y: 0 },
      isPickerVisible: false,
      linkCreation: {
        creating: false,
        position: { x: 0, y: 0 },
        hasDestination: false,
        destination: { node: 0, input: 0 },
        valid: true,
        origin: { node: 0, output: 0 }
      }
    }
  },
  components: {
    Canvas,
    Node,
    NodePicker
  },
  mounted: function () {
    var vm = this
    window.addEventListener('keyup', function (e) {
      if ((e.which || e.keyCode) === 32) {
        vm.isPickerVisible = !vm.isPickerVisible
      }
    })
  },
  methods: {
    deleteNode: function (id) {
      let index = this.nodes.findIndex(item => item.id === id)
      this.$delete(this.nodes, index)
    }
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
