require "../setup"

ByteGrid = require "../lib/byte-grid"
{gaussian, noise} = require("../terrain/generate")
Renderer = require "../visualizer/grid-renderer"
Canvas = require "../canvas"
Game = require "../game"

renderer = Renderer()

view =
  x: 0
  y: 0
  width: 32
  height: 18

state =
  viewport: view
  activeTool: "pan"

game = Game state

grid = ByteGrid
  width: 32
  height: 18

canvas = Canvas(game, width: 512, height: 288)
canvas.element().classList.add "primary"

document.body.appendChild(canvas.element())

drawValue = (canvas, size, value, x, y) ->
  value = grid2.get(x, y)
  return unless value?

  canvas.drawRect
    color: "rgb(#{value}, 0, #{value})"
    x: x * size
    y: y * size
    width: size
    height: size

draw = ->
  renderer.draw canvas, grid, game.viewport(), drawValue

gaussianKernel = [0.006, 0.061, 0.242, 0.383, 0.242, 0.061, 0.006]

# Fill blur using a gaussian blur filter
gaussian2 = (source, destination, state) ->
  {data:sourceData, width, height} = source
  length = sourceData.length

  destinationData = destination.data

  state.swap ?= ByteGrid
    width: width
    height: height

  {swap} = state

  # Apply blur kernel horizontally then vertically
  doStepX = (state) ->
    {i, y} = state
    x = i % width
    v = gaussianKernel.reduce (total, ratio, index) ->
      (grid.get(index - 3 + x, y) ? 128) * ratio + total
    , 0

    swap.set(x, y, v)
    destination.set(x, y, v)

    if x is width - 1
      state.y += 1
    state.i += 1

  doStepY = (state) ->
    {i, x} = state
    i = i % sourceData.length
    y = i % height
    v = gaussianKernel.reduce (total, ratio, index) ->
      (swap.get(x, index - 3 + y) ? 128) * ratio + total
    , 0

    destination.set(x, y, v)

    if y is height - 1
      state.x += 1
    state.i += 1

  if state.i < sourceData.length
    doStepX(state)
  else if state.i < 2 * sourceData.length
    doStepY(state)
  else
    state.i = state.x = state.y = 0

  return grid

noise(grid)

grid2 = ByteGrid
  width: grid.width
  height: grid.height

n = 1
state =
  i: 0
  y: 0
  x: 0
step = ->
  draw()

  gaussian2(grid, grid2, state)
  gaussian2(grid, grid2, state)
  n += 1

  requestAnimationFrame step
step()
