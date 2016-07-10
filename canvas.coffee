TouchCanvas = require "touch-canvas"

module.exports = (state) ->
  canvas = TouchCanvas
    width: 512
    height: 288

  canvas.on "touch", (e) ->
    Tools[state.activeTool].touch(e, state)

  canvas.on "move", (e) ->
    Tools[state.activeTool].move(e, state)

  canvas.on "release", (e) ->
    Tools[state.activeTool].release(e, state)

  return canvas

SimpleTool = (touch) ->
  touch: touch
  move: ->
  release: ->

Tools =
  pan: do ->
    startPos = null
    initialPan = null

    touch: (e, {viewport}) ->
      startPos = e
      initialPan =
        x: viewport.x
        y: viewport.y

    move: ({x, y}, {viewport}) ->
      if startPos
        {x:sX, y:sY} = startPos
        deltaX = (sX - x) * viewport.width
        deltaY = (sY - y) * viewport.height

        viewport.x = initialPan.x + deltaX
        viewport.y = initialPan.y + deltaY

    release: (e, {viewport}) ->
      console.log e, viewport
      startPos = null

  inspect: SimpleTool (e, state) ->
    console.log worldPosition(e, state.viewport)

worldPosition = ({x, y}, viewport) ->
  x: x * viewport.width
  y: y * viewport.height
