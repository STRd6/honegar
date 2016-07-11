Model = require "model"

World = require "./world"

module.exports = (I={}, self=Model(I)) ->
  I.step ?= 0
  
  self.attrObservable "activeTool", "tools"
  self.attrAccessor "viewport"

  self.attrModel "world", World

  self.extend
    update: ->
      if I.step % 10 is 0
        self.world().entities().forEach (entity) ->
          entity[1] += Math.floor(Math.random() * 3) - 1
          entity[2] += Math.floor(Math.random() * 3) - 1

      I.step += 1

  return self
