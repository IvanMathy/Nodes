export default function (displayNode, nodes) {
  let allNodes = nodes.reduce(function (map, node) {
    map[node.id] = node
    return map
  }, {})

  if (displayNode.inputs[0].link && displayNode.inputs[0].link.node) {
    return computeNode(allNodes[displayNode.inputs[0].link.node], allNodes)
  }

  return false
}

function computeNode (node, allNodes) {
  var inputs = []

  if (node.inputs) {
    inputs = node.inputs.map(function (input) {
      if (input.link && input.link.node) {
        return computeNode(allNodes[input.link.node], allNodes)
      } else return false
    })
  }

  switch (node.type) {
    case 'input':
    case 'slider':
      return parseFloat(node.value)
    case 'add':
      return inputs[0] + inputs[1]
    case 'subtract':
      return inputs[0] - inputs[1]
    case 'multiply':
      return inputs[0] * inputs[1]
    case 'divide':
      return inputs[0] / inputs[1]
    case 'power':
      return Math.pow(inputs[0], inputs[1])
  }
  return false
}
