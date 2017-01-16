module.exports = (sheets, characters) ->
  S = 16 # Tile size

  autoTileDeltas = [
    []
    [
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
    [ # This is for water tiles but it is all jacked up :P
      [3, 0]
      [3, 0] # 1
      [-1, -1] # 2
      [-1, 0]
      [3, -1]
      [-1, -1]
      [-1, -1]
      [-1, 0]
      [6, -1] # 8
      [1, 0]
      [0, -1]
      [0, 0]
      [1, -1]
      [1, 0]
      [0, -1]
      [0, 0]
    ]
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

  drawTile = (canvas, world, tiles, index, t, x, y) ->
    return unless index?

    [sheetIndex, tx, ty, autoTile, altSheet] = tiles[index]
    if altSheet? and t % 1000 < 500
      sheet = sheets[altSheet]
    else
      sheet = sheets[sheetIndex]

    if autoTile
      [dtx, dty] = autoTileDeltas[autoTile][autoTileValue(world, index, x, y)]
      tx += dtx
      ty += dty

    drawSprite(canvas, sheet, tx, ty, x, y)

    return

  drawValue = (canvas, value, x, y) ->
    return unless value?

    canvas.drawRect
      color: "rgb(#{value}, 128, #{value})"
      x: x * S
      y: y * S
      width: S
      height: S

  draw: (canvas, game, viewport) ->
    world = game.world()
    tiles = game.tiles()

    t = +new Date
    canvas.fill('rgb(89, 125, 206)')

    transform = Matrix.translate((-S * viewport.x)|0, (-S * viewport.y)|0)

    renderView =
      x: Math.floor viewport.x
      y: Math.floor viewport.y
      width: viewport.width + 1
      height: viewport.height + 1

    canvas.withTransform transform, (canvas) ->
      # Draw Tiles
      world.region renderView, (value, x, y) ->
        drawTile(canvas, world, tiles, value, t, x, y)
        #drawValue(canvas, value, x, y)
        return

      # Draw Objects

      # Draw Characters
      world.entities().forEach (entity) ->
        index = entity.index()
        {x, y} = entity.position()
        food = entity.favoriteFood()

        drawCharacter canvas, index, t, x, y
