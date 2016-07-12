Model = require "model"

module.exports = (I={}, self=Model(I)) ->
  self.attrObservable "index"
  self.attrModel "position", Point

  self.extend
    move: ->
      position = self.position()
      delta = Point rand(3)-1, rand(3)-1

      self.position(position.add(delta))

  return self
