Matrix = require "matrix"

module.exports = (sheets, tiles, characters) ->
  S = 16 # Tile size

  autoTileDelta = [
    [4, -1]
    [2, 1]
    [3, 0]
    [-1, 1]
    [2, -1]
    [2, 0]
    [-1, -1]
    [-1, 0]
    [5, 0] # 8
    [1, 1]
    [4, 0]
    [0, 1]
    [1, -1]
    [1, 0]
    [0, -1]
    [0, 0]
  ]

  adjacents = [
    [0, -1]
    [1, 0]
    [0, 1]
    [-1, 0]
  ]
  # Compute an auto-tile n-value 0-15
  # Count up top, right, bottom, left, tiles that are the same
  # Assume off-grid tiles are the same
  autoTileValue = (world, tile, x, y) ->
    mult = 1

    adjacents.map ([dx, dy]) ->
      (world.getTile(x + dx, y + dy) ? tile) is tile
    .reduce (total, match) ->
      total = total + match * mult
      mult *= 2
      total
    , 0

  drawSprite = (canvas, sheet, sx, sy, x, y) ->
    canvas.drawImage(sheet,
      sx * S, sy * S, S, S, # Source
      x * S, y * S, S, S # Destination
    )

  drawCharacter = (canvas, index, t, x, y) ->
    [sheetIndex, tx, ty] = characters[index]

    if t % 1000 < 500
      sheetIndex += 1

    sheet = sheets[sheetIndex]

    drawSprite(canvas, sheet, tx, ty, x, y)

    return

  drawTile = (canvas, world, index, x, y) ->
    return unless index?

    [sheetIndex, tx, ty, autoTile] = tiles[index]
    sheet = sheets[sheetIndex]

    if autoTile
      [dtx, dty] = autoTileDelta[autoTileValue(world, index, x, y)]
      tx += dtx
      ty += dty

    drawSprite(canvas, sheet, tx, ty, x, y)

    return

  draw: (canvas, world, view) ->
    t = +new Date
    canvas.fill('rgb(89, 125, 206)')

    transform = Matrix.translate((-S * view.x)|0, (-S * view.y)|0)
    
    renderView =
      x: Math.floor view.x
      y: Math.floor view.y
      width: view.width + 1
      height: view.height + 1

    canvas.withTransform transform, (canvas) ->
      # Draw Tiles
      world.region renderView, (value, x, y) ->
        drawTile(canvas, world, value, x, y)
        return

      # Draw Objects

      # Draw Characters
      world.entities().forEach ([index, x, y]) ->
        drawCharacter canvas, index, t, x, y
