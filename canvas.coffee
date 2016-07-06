TouchCanvas = require "touch-canvas"

module.exports = (viewport) ->
  canvas = TouchCanvas
    width: 512
    height: 288

  startPos = null
  initialPan = null
  canvas.on "touch", (e) ->
    startPos = e
    initialPan =
      x: viewport.x
      y: viewport.y

  canvas.on "move", ({x, y}) ->
    if startPos
      {x:sX, y:sY} = startPos
      deltaX = (sX - x) * viewport.width
      deltaY = (sY - y) * viewport.height

      viewport.x = initialPan.x + deltaX
      viewport.y = initialPan.y + deltaY
  
  canvas.on "release", (e) ->
    console.log e, viewport
    startPos = null

  return canvas
