ByteGrid = require "./lib/byte-grid"

Entity = require "./entity"

{noise, gaussian} = require("./terrain/generate")

{histogram, spark} = require "./util/histogram"

module.exports = (I={}) ->
  defaults I,
    width: 64
    height: 64

  {width, height} = I

  grid = ByteGrid
    width: width
    height: height

  noise(grid)

  spark histogram grid.data.slice(0, 512)

  gaussian(grid)
  
  spark histogram grid.data.slice(0, 512)

  plainChoice = [0, 2]

  grid.data.forEach (datum, i) ->
    if datum < 110
      grid.data[i] = 1
    else if datum > 150
      grid.data[i] = 7
    else
      grid.data[i] = plainChoice[rand(2)]

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

    entityAt: (position) ->
      (entities.filter (entity) ->
        entity.position().equal(position)
      )[0]
