import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
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
  },
  mutations: {
    deleteNode (state, id) {
      let index = state.nodes.findIndex(item => item.id === id)
      state.nodes.splice(index, 1)
    },
    addNode (state, node) {
      state.nodes.push(node)
    }
  }
})
