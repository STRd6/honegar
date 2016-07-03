# This is what passes for the game at any point in time. I expect to have
# a lot of experiments going in other files to mess around with systems!

# TODO
# Render a byte array as a tile map
# Designate jobs for your dwarfs
# Watch as they scamper around

require "./setup"
canvas = require "./canvas"

tile0 = null
tile1 = null

S = 16

update = ->

draw = ->
  canvas.fill('rgb(89, 125, 206)')

  if tile0
    #canvas.drawImage(tile0, 0, 0)
    #return

    [0...18].forEach (y) ->
      [0...32].forEach (x) ->
        canvas.drawImage(tile0, 8 * S, 7 * S, S, S, x * S, y * S, S, S)

step = ->
  update()
  draw()

  requestAnimationFrame step

step()

preload = require "./preload"

Promise.all [
  "Objects/Wall.png"
  "Objects/Floor.png"
  "Objects/Ground0.png"
  "Objects/Ground1.png"
].map preload
.then ([wall, floor, ground0, ground1]) ->
  tile0 = floor
