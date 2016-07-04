# This is what passes for the game at any point in time. I expect to have
# a lot of experiments going in other files to mess around with systems!

# TODO
# Render a byte array as a tile map
# Designate jobs for your dwarfs
# Watch as they scamper around

require "./setup"
canvas = require "./canvas"

Renderer = require "./render"
renderer = null

# Sheet index, sheetX, sheetY
tiles = [
  [1, 8, 7]
  [0, 3, 3]
  [4, 0, 0]
  [5, 0, 0]
]

characters = [
  [4, 0, 0]
]

view = {}
world = {}

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
  renderer = Renderer(sheets, tiles, characters)
