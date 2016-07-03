# This is what passes for the game at any point in time. I expect to have
# a lot of experiments going in other files to mess around with systems!

# TODO
# Render a byte array as a tile map
# Designate jobs for your dwarfs
# Watch as they scamper around

require "./setup"
canvas = require "./canvas"

tiles0 = null

S = 16

update = ->

draw = ->
  canvas.fill('rgb(89, 125, 206)')

  if tiles0
    [0...18].forEach (y) ->
      [0...32].forEach (x) ->
        canvas.drawImage(tiles0, 3 * S, 3 * S, S, S, x * S, y * S, S, S)

step = ->
  update()
  draw()

  requestAnimationFrame step

step()

Ajax = require "ajax"
ajax = Ajax()

ajax.getBlob("https://danielx.whimsy.space/DawnLike/Objects/Wall.png?o_0")
.then (blob) ->
  new Promise (resolve, reject) ->
    img = new Image
    img.onload = ->
      resolve(img)
    img.onerror = reject
    img.src = URL.createObjectURL(blob)
.then (img) ->
  tiles0 = img
