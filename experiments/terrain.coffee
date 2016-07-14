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
  width: 64
  height: 64

noise(grid)
gaussian(grid)

canvas = Canvas(game, width: 512, height: 288)
canvas.element().classList.add "primary"

document.body.appendChild(canvas.element())

drawValue = (canvas, size, value, x, y) ->
  return unless value?

  canvas.drawRect
    color: "rgb(#{value}, 0, #{value})"
    x: x * size
    y: y * size
    width: size
    height: size

draw = ->
  renderer.draw canvas, grid, game.viewport(), drawValue

step = ->
  draw()

  requestAnimationFrame step
step()
