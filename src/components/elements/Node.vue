<template>
  <div class="node" :class="[{ compact: compact }]" tabindex="0" @dblclick="toggleCompact">
    <h3 class="title" v-if="!compact">&nbsp;&nbsp;{{node.title}}&nbsp;&nbsp;</h3>
    <div class="delete" @click.prevent="deleteNode"></div>

    <div class="input" v-if="node.type === 'input'">
      <input v-model="node.value">
    </div>

    <div class="inputs">
      <p v-for="(input, index) in node.inputs" :key="index" :index="index">
        <i class="port" :ref="'nodeInput'+input.id" :index="index"
          type="input" @contextmenu.prevent="portContextMenu"
          @mouseover="portMouseOver(index, 'nodeInput'+input.id)"/>
        <template  v-if="!compact">{{ input.name }}</template>
      </p>
    </div>

    <div v-if="node.type === 'slider'" class="sliderContainer">
      <input  class="slider"  type="range" v-model="node.value" step="0.01" min="0" max="1" @mousedown.stop>
    </div>

    <div class="compactName"  v-if="compact">
      {{ node.symbol }}
    </div>

    <div class="outputs">
      <p v-for="(output, index) in node.outputs" :key="index" :index="index">
        <template v-if="!compact">
          <template v-if="node.type === 'slider'">{{ sliderValue }}</template>
          <template v-else>{{ output.name }}</template>
        </template>
        <i class="port" :ref="'nodeOutput'+output.id" type="output"
        @mousedown.prevent="portMouseDown($event, index)"/>
      </p>
    </div>
    <div class="display" v-if="node.type === 'display'">
      {{ outputValue }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Calculator from '../../calculator'

var initX, initY, mousePressX, mousePressY

export default {
  name: 'Node',
  props: ['node'],
  mounted () {
    var vm = this
    this.$el.addEventListener('mousedown', onMouseDown)
    vm.$el.style.left = this.node.position.x + this.offset.x + 'px'
    vm.$el.style.top = this.node.position.y + this.offset.y + 'px'

    this.updateOffsets()

    function onMouseDown (event) {
      initX = vm.node.position.x
      initY = vm.node.position.y
      mousePressX = event.clientX
      mousePressY = event.clientY

      window.addEventListener('mousemove', onMove, false)

      window.addEventListener('mouseup', function () {
        window.removeEventListener('mousemove', onMove, false)
      }, false)
    }

    function onMove (event) {
      vm.node.position.x = initX + event.clientX - mousePressX
      vm.node.position.y = initY + event.clientY - mousePressY
      vm.$el.style.left = vm.node.position.x + vm.offset.x + 'px'
      vm.$el.style.top = vm.node.position.y + vm.offset.y + 'px'
    }
  },
  data: function () {
    return {
      compact: this.node.compact
    }
  },
  computed: {
    sliderValue () {
      return parseFloat(this.node.value).toFixed(2)
    },
    outputValue () {
      // Output is limited to 2 decimal places to make things a bit nicer.
      return parseFloat(Calculator(this.node, this.$store.state.nodes)).toFixed(2)
    },
    ...mapState([
      'nodes',
      'offset'
    ])
  },
  watch: {
    offset: {
      handler (e) {
        this.$el.style.left = this.node.position.x + this.offset.x + 'px'
        this.$el.style.top = this.node.position.y + this.offset.y + 'px'
      },
      deep: true
    }
  },
  methods: {
    toggleCompact () {
      this.compact = !this.compact
      this.$nextTick(() => {
        this.updateOffsets()
        this.$set(this.node, 'compact', this.compact)
      })
    },
    updateOffsets () {
      for (var ref in this.$refs) {
        var obj = this.$refs[ref][0]
        let index = obj.parentNode.getAttribute('index')
        if (obj.getAttribute('type') === 'input') {
          this.$set(this.node.inputs[index], '_offset',
            { x: obj.parentElement.parentElement.offsetLeft,
              y: obj.parentElement.parentElement.offsetTop + obj.parentElement.offsetTop })
        } else if (obj.getAttribute('type') === 'output') {
          this.$set(this.node.outputs[index], '_offset',
            { x: obj.parentElement.parentElement.offsetLeft + obj.offsetLeft,
              y: obj.parentElement.parentElement.offsetTop + obj.parentElement.offsetTop })
        }
      }
    },
    portContextMenu: function (e) {
      this.$delete(this.node.inputs[e.target.getAttribute('index')], 'link')
    },
    portMouseDown: function (e, index) {
      e.stopPropagation()
      var vm = this

      vm.$store.state.linkCreation.creating = true
      vm.$store.state.linkCreation.origin.node = vm.node.id
      vm.$store.state.linkCreation.origin.output = index

      vm.$store.state.linkCreation.position.x = e.clientX
      vm.$store.state.linkCreation.position.y = e.clientY

      var onMouseMove = function (e) {
        vm.$store.state.linkCreation.position.x = e.clientX
        vm.$store.state.linkCreation.position.y = e.clientY
      }

      window.addEventListener('mousemove', onMouseMove, false)

      window.addEventListener('mouseup', function (e) {
        e.stopPropagation()
        vm.$store.state.linkCreation.creating = false
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseMove)

        var link = vm.$store.state.linkCreation

        if (link.hasDestination && link.destination.node !== link.origin.node && link.valid) {
          let node = vm.$store.state.nodes.find(function (e) {
            return e.id === link.destination.node
          })
          let input = node.inputs[link.destination.input]
          vm.$set(input, 'link', { node: link.origin.node, output: link.origin.output })
        }
      }, { once: true })

      return false
    },
    portMouseOver: function (index, ref) {
      var vm = this
      if (vm.$store.state.linkCreation.creating) {
        vm.$store.state.linkCreation.hasDestination = true
        vm.$store.state.linkCreation.destination.node = vm.node.id
        vm.$store.state.linkCreation.destination.input = index

        vm.$refs[ref][0].addEventListener('mouseout', function (e) {
          vm.$store.state.linkCreation.hasDestination = false
        }, { once: true })
      }
    },
    deleteNode: function () {
      this.$store.commit('deleteNode', this.node.id)
    }
  }
}

</script>

<style scoped>

.node {
  display: block;
  background-color: #303133;
  border: solid 1px #1a1a1c;
  border-radius: 4px;
  position: absolute;
  outline: none;

  -webkit-box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.3), inset 0px 1px 0px 0px rgba(209,209,209,.1);
  -moz-box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.3), inset 0px 1px 0px 0px rgba(209,209,209,.1);
  box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.3), inset 0px 1px 0px 0px rgba(209,209,209,.1);

  -webkit-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  white-space:nowrap;
}

.node:focus {
  -webkit-box-shadow: 0px 0px 2px 0px rgba(12,178,255,1), 0px 1px 1px 0px rgba(0,0,0,0.3), inset 0px 1px 0px 0px rgba(209,209,209,.1);
  -moz-box-shadow: 0px 0px 2px 0px rgba(12,178,255,1), 0px 1px 1px 0px rgba(0,0,0,0.3), inset 0px 1px 0px 0px rgba(209,209,209,.1);
  box-shadow: 0px 0px 2px 0px rgba(12,178,255,1), 0px 1px 1px 0px rgba(0,0,0,0.3), inset 0px 1px 0px 0px rgba(209,209,209,.1);
  border-color: #0cb2ff;
}

.node > .delete {
  display: none;
  width: 10px;
  height: 10px;
  background-color: #101111;
  float: right;
  position: absolute;
  top: 4px;
  right: 4px;
  border-radius: 2px;
  font: 14px/100% arial, sans-serif;
  color: #303133;
  cursor: pointer;
}

.node > .delete:hover {
  background-color: white;
}
.node > .delete:after {
  content: '×';
  top: -2px;
  left: 1px;
  position: absolute;
}

.node:hover > .delete {
  display: block;
}

.compact:hover > .delete {
  display: none;
}

h3.title {
  color: white;
  font-size: 14px;
  margin-top: 5px;
}

.inputs {
  position: relative;
  display: inline-block;
  left: -6px;
  color: white;
  font-size: 10px;
  white-space:nowrap;
  margin-bottom: 5px;
  float: left;
  bottom: 0;
}
.compact > .inputs {
  top: 10px;
}
.outputs {
  position: absolute;
  display: inline-block;
  right: -6px;
  white-space:nowrap;
  color: white;
  font-size: 10px;
  margin-bottom: 5px;
  bottom: 0px;
  text-align: right;
}
.port{
  width: 10px;
  height:10px;
  border-radius: 5px;
  background-color: #0cb2ff;
  border: 1px solid #262728;
  display: inline-block;

  -webkit-box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.3);
  -moz-box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.3);
  box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.3);

  margin-bottom: -2px;

}
.input {
  position: relative;
  display: inline-block;
  left: 5px;
  top: -5px;
  color: white;
  font-size: 10px;
  white-space:nowrap;
  margin-bottom: 0px;
  margin-top: 10px;
  margin-right: 35px;
}
.compact > .input {
  margin-right: 5px;
}
.input input {
  width: 40px;
  height: 25px;
  background-color: #101111;
  color: white;
  text-align: right;
  font-size: 15px;
  border: none;
  border-radius: 4px;
  padding-right: 5px;
}
.display {
  position: relative;
  display: inline-block;
  right: 20px;
  white-space:nowrap;
  color: white;
  font-size: 24px;
  margin-right: 5px;
  text-align: right;
  min-width: 50px;
  margin-left: 20px;
}
.slider {
    -webkit-appearance: none;
    width: 70px;
    height: 5px;
    border-radius: 5px;
    background: #777;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
    border: none;
    margin-right: 30px;
    margin-bottom: 4px;
    padding: 0;
}
.compact .slider {
  margin-right: 10px;
  float: left;
  margin-top: 9px;
  margin-bottom: 9px;
}
.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #BBB;
    cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #BBB;
  cursor: pointer;
  border: none;
}
input[type=range]::-moz-range-track {
  background-color: transparent;
}
input[type=range]::-moz-focus-outer {
  border: 0;
}
.compactName {
  display: inline-block;
  color: #CCC;
  position: relative;
  top: -4px;
}
</style>
