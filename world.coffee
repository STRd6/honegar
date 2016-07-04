ByteGrid = require "./lib/byte-grid"

module.exports = (I) ->
  {width, height} = I

  grid = ByteGrid
    width: width
    height: height

  entities = []

  self =
    region: grid.region
      
    entities: ->
      entities
