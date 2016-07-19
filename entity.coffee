Model = require "model"

foods = require "./emojis/food"
generator = require("/culture/name_generator")()

console.log foods

module.exports = (I={}, self=Model(I)) ->
  defaults I,
    age: Math.floor Math.random()*30 + 11
    favoriteFood: foods.rand()
    hometown: generator.randomCity()
    name: generator.generate()
    zodiac: generator.zodiac()

  self.attrObservable "age", "favoriteFood", "hometown", "index", "name", "zodiac"
  self.attrModel "position", Point

  self.extend
    move: (world) ->
      position = self.position()
      delta = Point rand(3)-1, rand(3)-1

      newPosition = position.add(delta)

      if world.passable(newPosition)
        self.position(newPosition)

  return self
