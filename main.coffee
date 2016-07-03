# This is what passes for the game at any point in time. I expect to have
# a lot of experiments going in other files to mess around with systems!

# Render a byte array as a tile map
# Designate jobs for your dwarfs
# Watch as they scamper around

require "./setup"
canvas = require "./canvas"

update = ->

draw = ->
  canvas.fill('rgb(89, 125, 206)')

step = ->
  update()
  draw()

  requestAnimationFrame step

step()
