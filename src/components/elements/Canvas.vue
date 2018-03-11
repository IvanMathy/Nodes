<template>
  <canvas class="canvas" ref="canvas" v-bind:style="{ 'background-position': offset.x +'px ' + offset.y + 'px'}"></canvas>
</template>

<script>
import { mapState } from 'vuex'

var vm, canvas, context, initX, initY, mousePressX, mousePressY
let headerSize = 40 // This could probably be better

export default {
  name: 'Canvas',
  mounted () {
    vm = this
    canvas = this.$refs.canvas
    context = canvas.getContext('2d')

    context.scale(2, 2)

    window.addEventListener('resize', onResize, false)
    canvas.addEventListener('mousedown', onMouseDown, false)

    function onMouseDown (event) {
      initX = vm.offset.x
      initY = vm.offset.y
      mousePressX = event.clientX
      mousePressY = event.clientY

      window.addEventListener('mousemove', onMove, false)

      window.addEventListener('mouseup', function () {
        window.removeEventListener('mousemove', onMove, false)
      }, false)
    }
    function onMove (event) {
      vm.offset.x = initX + event.clientX - mousePressX
      vm.offset.y = initY + event.clientY - mousePressY
      draw()
    }
    onResize()
    // Lines can't be drawn if the nodes aren't initialized yet, so we wait a bit
    // and redraw everything once it had time to think a little.
    setTimeout(onResize, 30)
  },
  computed: mapState([
    'nodes',
    'offset',
    'linkCreation'
  ]),
  watch: {
    nodes: {
      handler (val) {
        draw()
      },
      deep: true
    },
    linkCreation: {
      handler (val) {
        draw()
      },
      deep: true
    }
  }
}

function onResize () {
  canvas.width = window.innerWidth * 2
  canvas.height = (window.innerHeight - headerSize) * 2
  canvas.style.height = window.innerHeight - headerSize

  draw()
}

function draw () {
  context.clearRect(0, 0, canvas.width, canvas.height)
  // drawBackground()
  drawLines()
  drawNewLink()
}

function drawBackground () {
  var width = canvas.width
  var height = canvas.height
  let squareSize = 30

  context.fillStyle = '#41424488'
  context.beginPath()
  for (var x = -2; x < width / squareSize / 2 + 2; ++x) {
    for (var y = -2; y < height / squareSize + 2; ++y) {
      context.rect(vm.offset.x % squareSize * 2 + x * squareSize * 2 + (squareSize * (y % 2)),
        vm.offset.y % squareSize * 2 + y * squareSize, squareSize, squareSize)
    }
  }
  context.fill()
  context.closePath()
}

function drawLines () {
  // Seems like Webkit and Firefox do not render lines from the same origin.
  var isWebkit = 'WebkitAppearance' in document.documentElement.style
  var portOffset = isWebkit ? 8 : 6.5

  context.fillStyle = 'transparent'

  let nodes = vm.nodes.reduce(function (map, node) {
    map[node.id] = node
    return map
  }, {})

  vm.nodes.map(node => {
    if (node.inputs) {
      node.inputs.map(input => {
        if ('link' in input && input._offset) {
          let otherNode = nodes[input.link.node]

          if (otherNode === undefined) {
            // The other node probably got deleted.
            vm.$delete(input, 'link')
            return
          }

          let output = otherNode.outputs.find(function (e) {
            return e.id === input.link.output
          })

          // It looks strange, but the following code is actually straightforward.
          // Essentially, we're computing the position of each port (the dots) based
          // on the node's position, global offset, and local offset of the port.
          // Then, we offset a bit more so that the line starts/end in the middle of
          // said port. We x2 everything for retina screens (that should be dynamic).
          // The "handle" of each bezier point is simply put 100px to the left or
          // the right of the port, to simulate of bit of tension on the cable.
          //
          // If it still doesn't make sense, hit me up on Twitter @okatbest!

          context.beginPath()

          context.moveTo((node.position.x + input._offset.x + vm.offset.x + portOffset) * 2,
            (node.position.y + input._offset.y + vm.offset.y + portOffset) * 2)
          context.bezierCurveTo((node.position.x + input._offset.x + vm.offset.x + portOffset) * 2 - 100,
            (node.position.y + input._offset.y + vm.offset.y + portOffset) * 2,
            (otherNode.position.x + output._offset.x + vm.offset.x + portOffset) * 2 + 100,
            (otherNode.position.y + output._offset.y + vm.offset.y + portOffset) * 2,
            (otherNode.position.x + output._offset.x + vm.offset.x + portOffset) * 2,
            (otherNode.position.y + output._offset.y + vm.offset.y + portOffset) * 2)

          context.lineWidth = 9
          context.strokeStyle = '#0d4370'
          context.stroke()

          context.lineWidth = 6
          context.strokeStyle = '#0cb2ff'
          context.stroke()

          context.closePath()
        }
      })
    }
  })
}

function drawNewLink () {
  var isWebkit = 'WebkitAppearance' in document.documentElement.style
  var portOffset = isWebkit ? 8 : 6.5
  var headerSize = 40 * 2

  context.fillStyle = 'transparent'

  let nodes = vm.nodes.reduce(function (map, node) {
    map[node.id] = node
    return map
  }, {})

  if (vm.linkCreation.creating) {
    let link = vm.linkCreation
    let originNode = nodes[link.origin.node]

    let output = originNode.outputs.find(function (e) {
      return e.id === link.origin.output
    })

    context.beginPath()

    if (link.hasDestination) {
      let destinationNode = nodes[link.destination.node]

      link.valid = checkNode(link.origin.node, link.destination.node)

      let input = destinationNode.inputs.find(function (e) {
        return e.id === link.destination.input
      })

      context.moveTo((destinationNode.position.x + input._offset.x + vm.offset.x + portOffset) * 2,
        (destinationNode.position.y + input._offset.y + vm.offset.y + portOffset) * 2)
      context.bezierCurveTo((destinationNode.position.x + input._offset.x + vm.offset.x + portOffset) * 2 - 100,
        (destinationNode.position.y + input._offset.y + vm.offset.y + portOffset) * 2,
        (originNode.position.x + output._offset.x + vm.offset.x + portOffset) * 2 + 100,
        (originNode.position.y + output._offset.y + vm.offset.y + portOffset) * 2,
        (originNode.position.x + output._offset.x + vm.offset.x + portOffset) * 2,
        (originNode.position.y + output._offset.y + vm.offset.y + portOffset) * 2)


      if (link.valid) {
        context.lineWidth = 9
        context.strokeStyle = '#118e15'
        context.stroke()

        context.lineWidth = 6
        context.strokeStyle = '#1de524'
        context.stroke()
      } else {
        context.lineWidth = 9
        context.strokeStyle = '#7c0101'
        context.stroke()

        context.lineWidth = 6
        context.strokeStyle = '#d80202'
        context.stroke()
      }
      context.closePath()
    } else {

      context.moveTo(link.position.x * 2, link.position.y * 2 - headerSize)
      context.bezierCurveTo(link.position.x * 2 - 10, link.position.y * 2 - headerSize,
        (originNode.position.x + output._offset.x + vm.offset.x + portOffset) * 2 + 100,
        (originNode.position.y + output._offset.y + vm.offset.y + portOffset) * 2,
        (originNode.position.x + output._offset.x + vm.offset.x + portOffset) * 2,
        (originNode.position.y + output._offset.y + vm.offset.y + portOffset) * 2)

      context.lineWidth = 9
      context.strokeStyle = '#911182'
      context.stroke()

      context.lineWidth = 6
      context.strokeStyle = '#f918df'
      context.stroke()
    }
    context.closePath()
  }

  // This should be a require. But writing a comment stating I know I did wrong
  // feels like less work. Don't judge me I write good code for a living this is
  // my escape and I only have 5 minutes before my canelés are finally cooked.

  function checkNode(originNode, destinationNode) {
    if (originNode === destinationNode) return false


    for (let index in nodes[originNode].inputs) {
      let input = nodes[originNode].inputs[index]
      if (input.link && input.link.node) {
        if (input.link.node === destinationNode) return false
        if (!checkNode(input.link.node, destinationNode)) return false
      }
    }
    return true
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.canvas {
  width: 100vw;
  display: block;
  background-image: url('./../../assets/grid.svg');
  background-size: 200px 200px;
}
</style>
