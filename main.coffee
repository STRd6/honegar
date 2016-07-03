# This is what passes for the game at any point in time. I expect to have
# a lot of experiments going in other files to mess around with systems!

# TODO
# Render a byte array as a tile map
# Designate jobs for your dwarfs
# Watch as they scamper around

require "./setup"
canvas = require "./canvas"

sheets = null
S = 16

# Sheet index, sheetX, sheetY
tiles = [
  [1, 8, 7]
  [0, 3, 3]
]

drawTile = (canvas, t, x, y) ->
  [sheetIndex, tx, ty] = tiles[t]
  sheet = sheets[sheetIndex]

  canvas.drawImage(sheet,
    tx * S, ty * S, S, S, # Source 
    x * S, y * S, S, S # Destination
  )

  return

update = ->

draw = ->
  canvas.fill('rgb(89, 125, 206)')

  if sheets
    #canvas.drawImage(sheets[0], 0, 0)
    #return

    [0...18].forEach (y) ->
      [0...32].forEach (x) ->
        drawTile(canvas, 0, x, y)
        return
      return

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
].map Preload.image
.then (s) ->
  sheets = s
