ByteGrid = require "./lib/byte-grid"

Entity = require "./entity"

module.exports = (I) ->
  {width, height} = I

  grid = ByteGrid
    width: width
    height: height

  [0...128].forEach (y) ->
    [0...128].forEach (x) ->
      grid.set(x, y, rand(3))

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
      self.getTile(x, y) != 1
