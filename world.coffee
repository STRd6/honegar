ByteGrid = require "./lib/byte-grid"

rand = (n) ->
  Math.floor(Math.random() * n)

module.exports = (I) ->
  {width, height} = I

  grid = ByteGrid
    width: width
    height: height

  [0...128].forEach (y) ->
    [0...128].forEach (x) -> 
      grid.set(x, y, rand(4))

  entities = []

  self =
    getTile: grid.get
    region: grid.region
      
    entities: ->
      entities
