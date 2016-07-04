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
  [4, 0, 0]
  [5, 0, 0]
]

characters = [
  [4, 0, 0]
]

drawSprite = (canvas, sheet, sx, sy, x, y) ->
  canvas.drawImage(sheet,
    sx * S, sy * S, S, S, # Source 
    x * S, y * S, S, S # Destination
  )

drawCharacter = (canvas, tileIndex, t, x, y) ->
  [sheetIndex, tx, ty] = characters[tileIndex]

  if t % 1000 < 500
    sheetIndex += 1

  sheet = sheets[sheetIndex]

  drawSprite(canvas, sheet, tx, ty, x, y)

  return

drawTile = (canvas, tileIndex, x, y) ->
  [sheetIndex, tx, ty] = tiles[tileIndex]
  sheet = sheets[sheetIndex]

  drawSprite(canvas, sheet, tx, ty, x, y)

  return

update = ->

draw = ->
  t = +new Date
  canvas.fill('rgb(89, 125, 206)')

  if sheets
    #canvas.drawImage(sheets[0], 0, 0)
    #return

    # Draw Tiles
    [0...18].forEach (y) ->
      [0...32].forEach (x) ->
        drawTile(canvas, 0, x, y)
        return
      return

    # Draw Objects

    # Draw Characters
    drawCharacter canvas, 0, t, 16, 9

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
.then (s) ->
  sheets = s
