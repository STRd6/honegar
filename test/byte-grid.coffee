ByteGrid = require "../lib/byte-grid"

describe "Byte Grid", ->
  it "should be a grid of bytes", ->
    grid = ByteGrid
      width: 10
      height: 10

    [0...10].forEach (y) ->
      [0...10].forEach (x) ->
        grid.set(x, y, x + 10 * y)

    assert.equal grid.get(5, 5), 55
    assert.equal grid.get(7, 1), 17

  it "should iterate a region", ->
    grid = ByteGrid
      width: 10
      height: 10

    [0...10].forEach (y) ->
      [0...10].forEach (x) ->
        grid.set(x, y, x + 10 * y)

    rect =
      x: 3
      y: 2
      width: 3
      height: 3

    grid.region rect, (value, x, y) ->
      console.log x, y, value
