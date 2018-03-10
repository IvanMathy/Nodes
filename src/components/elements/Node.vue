<template>
  <div class="node" tabindex="0">
    <h3 class="title">{{node.title}}</h3>
    <div class="delete" @click.prevent="deleteNode"></div>

    <div class="input" v-if="node.type === 'input'">
      <input :value="node.value">
    </div>

    <div class="inputs">
      <p v-for="(input, index) in node.inputs" :key="index" :index="index">
        <i class="port" :ref="'nodeInput'+input.id" :index="index"
          type="input" @contextmenu.prevent="portContextMenu"
          @mouseover="portMouseOver(index, 'nodeInput'+input.id)"/>
        {{ input.name }}
      </p>
    </div>

    <div class="outputs">
      <p v-for="(output, index) in node.outputs" :key="index" :index="index">
        {{ output.name }}
        <i class="port" :ref="'nodeOutput'+output.id" type="output"
        @mousedown.prevent="portMouseDown($event, index)"/>
      </p>
    </div>
    <div class="display" v-if="node.type === 'display'">
      200
    </div>
  </div>
</template>

<script>
var initX, initY, mousePressX, mousePressY

export default {
  name: 'Node',
  props: ['node', 'offset', 'delete'],
  mounted () {
    var vm = this
    this.$el.addEventListener('mousedown', onMouseDown)
    vm.$el.style.left = this.node.position.x + this.offset.x + 'px'
    vm.$el.style.top = this.node.position.y + this.offset.y + 'px'

    for (var ref in this.$refs) {
      var obj = this.$refs[ref][0]
      let index = obj.parentNode.getAttribute('index')
      if (obj.getAttribute('type') === 'input') {
        this.node.inputs[index]._offset =
          { x: obj.parentElement.parentElement.offsetLeft,
            y: obj.parentElement.parentElement.offsetTop + obj.parentElement.offsetTop}
      } else if (obj.getAttribute('type') === 'output') {
        this.node.outputs[index]._offset =
          { x: obj.parentElement.parentElement.offsetLeft + obj.offsetLeft,
            y: obj.parentElement.parentElement.offsetTop + obj.parentElement.offsetTop}
      }
    }

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
    portContextMenu: function (e) {
      this.$delete(this.node.inputs[e.target.getAttribute('index')], 'link')
    },
    portMouseDown: function (e, index) {
      e.stopPropagation()
      var vm = this

      vm.$parent.linkCreation.creating = true
      vm.$parent.linkCreation.origin.node = vm.node.id
      vm.$parent.linkCreation.origin.output = index

      vm.$parent.linkCreation.position.x = e.clientX
      vm.$parent.linkCreation.position.y = e.clientY

      var onMouseMove = function (e) {
        vm.$parent.linkCreation.position.x = e.clientX
        vm.$parent.linkCreation.position.y = e.clientY
      }

      window.addEventListener('mousemove', onMouseMove, false)

      window.addEventListener('mouseup', function (e) {
        e.stopPropagation()
        vm.$parent.linkCreation.creating = false
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseMove)

        var link = vm.$parent.linkCreation

        if (link.hasDestination && link.destination.node !== link.origin.node && link.valid) {
          let node = vm.$parent.nodes.find(function (e) {
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
      if (vm.$parent.linkCreation.creating) {
        vm.$parent.linkCreation.hasDestination = true
        vm.$parent.linkCreation.destination.node = vm.node.id
        vm.$parent.linkCreation.destination.input = index

        vm.$refs[ref][0].addEventListener('mouseout', function (e) {
          vm.$parent.linkCreation.hasDestination = false
        }, { once: true })
      }
    },
    deleteNode: function () {
      this.delete(this.node.id)
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
}
.outputs {
  position: relative;
  display: inline-block;
  right: -6px;
  white-space:nowrap;
  color: white;
  font-size: 10px;
  margin-bottom: 5px;
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
  color: white;
  font-size: 10px;
  white-space:nowrap;
  margin-bottom: 5px;
  margin-top: 10px;
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
  right: 5px;
  white-space:nowrap;
  color: white;
  font-size: 25px;
  margin: 5px;
  text-align: right;
  min-width: 50px;
}
</style>
