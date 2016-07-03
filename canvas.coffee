TouchCanvas = require "touch-canvas"

canvas = TouchCanvas
  width: 512
  height: 288

document.body.appendChild canvas.element()

module.exports = canvas
