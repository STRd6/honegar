Model = require "model"

generator = require("/culture/name_generator")()

module.exports = (I={}, self=Model(I)) ->
  defaults I,
    age: Math.floor Math.random()*30 + 11
    hometown: generator.randomCity()
    name: generator.generate()

  self.attrObservable "index", "name"
  self.attrModel "position", Point

  self.extend
    move: ->
      position = self.position()
      delta = Point rand(3)-1, rand(3)-1

      self.position(position.add(delta))

  return self
