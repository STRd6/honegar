module.exports = (sheets, tiles, characters) ->
  S = 16 # Tile size

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

  drawTile = (canvas, index, x, y) ->
    [sheetIndex, tx, ty] = tiles[index]
    sheet = sheets[sheetIndex]

    drawSprite(canvas, sheet, tx, ty, x, y)

    return

  draw: (canvas, world, view) ->
    t = +new Date
    canvas.fill('rgb(89, 125, 206)')
  
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
