TouchCanvas = require "touch-canvas"

module.exports = (game, {width, height}) ->
  canvas = TouchCanvas
    width: width
    height: height

  canvas.on "touch", (e) ->
    Tools[game.activeTool()].touch(e, game)

  canvas.on "move", (e) ->
    Tools[game.activeTool()].move(e, game)

  canvas.on "release", (e) ->
    Tools[game.activeTool()].release(e, game)

  return canvas

SimpleTool = (touch) ->
  touch: touch
  move: ->
  release: ->

Tools =
  pan: do ->
    startPos = null
    initialPan = null

    touch: (e, game) ->
      viewport = game.viewport()

      startPos = e
      initialPan =
        x: viewport.x
        y: viewport.y

    move: ({x, y}, game) ->
      viewport = game.viewport()

      if startPos
        {x:sX, y:sY} = startPos
        deltaX = (sX - x) * viewport.width
        deltaY = (sY - y) * viewport.height

        viewport.x = initialPan.x + deltaX
        viewport.y = initialPan.y + deltaY

    release: (e, game) ->
      startPos = null

  inspect: SimpleTool (e, game) ->
    p = worldPosition(e, game.viewport())

    c = game.world().entityAt(p)

    if c
      game.inspectedCharacter c

worldPosition = ({x, y}, viewport) ->
    x: viewport.x + (x * viewport.width)|0
    y: viewport.y + (y * viewport.height)|0
