# This is what passes for the game at any point in time. I expect to have
# a lot of experiments going in other files to mess around with systems!

# TODO
# Render a byte array as a tile map
# Designate jobs for your dwarfs
# Watch as they scamper around

require "./setup"
canvas = require "./canvas"

World = require "./world"

Renderer = require "./render"
renderer = null

view =
  x: 12
  y: 7
  width: 32
  height: 18

world = World
  width: 512
  height: 512

update = ->

draw = ->
  renderer?.draw(canvas, world, view)

step = ->
  update()
  draw()

  requestAnimationFrame step

step()

Preload = require "./preload"

Promise.all [
  "Objects/Wall"
  "Objects/Floor"
  "Objects/Ground0"
  "Objects/Ground1"
  "Characters/Player0"
  "Characters/Player1"
].map Preload.image
.then (sheets) ->
  # Sheet index, sheetX, sheetY
  tiles = [
    [1, 1, 19]
    [1, 8, 7, true]
    [1, 15, 7, true]
    [1, 15, 19, true]
    [0, 3, 3]
    [4, 0, 0]
    [5, 0, 0]
  ]

  characters = [
    [4, 0, 0]
  ]
  renderer = Renderer(sheets, tiles, characters)
