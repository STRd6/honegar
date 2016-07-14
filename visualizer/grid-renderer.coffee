module.exports = ->
  size = 16

  draw: (canvas, grid, viewport, drawValue) ->
    canvas.fill('rgb(89, 125, 206)')

    transform = Matrix.translate((-size * viewport.x)|0, (-size * viewport.y)|0)

    renderView =
      x: Math.floor viewport.x
      y: Math.floor viewport.y
      width: viewport.width + 1
      height: viewport.height + 1

    canvas.withTransform transform, (canvas) ->
      # Draw Tiles
      grid.region renderView, (value, x, y) ->
        drawValue(canvas, size, value, x, y)
        return
