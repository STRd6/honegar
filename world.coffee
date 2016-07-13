ByteGrid = require "./lib/byte-grid"

Entity = require "./entity"

{gaussian} = require("./terrain/generate")

module.exports = (I) ->
  {width, height} = I

  grid = ByteGrid
    width: width
    height: height

  gaussian(grid)

  grid.data.forEach (datum, i) ->
    if datum < 110
      grid.data[i] = 1
    else if datum > 130
      grid.data[i] = 0
    else
      grid.data[i] = 2

  entities = [0...8].map (x) ->
    Entity
      index: x
      position:
        x: 16 + x % 5
        y: 13 + x % 3

  self =
    getTile: grid.get
    region: grid.region

    entities: ->
      entities

    passable: ({x, y}) ->
      return false unless 0 <= x < width
      return false unless 0 <= y < height

      !(self.getTile(x, y) % 2)
