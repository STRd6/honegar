Model = require "model"

World = require "./world"

module.exports = (I={}, self=Model(I)) ->
  I.step ?= 0

  self.attrObservable "activeTool", "tools"
  self.attrAccessor "viewport"
  self.attrAccessor "tiles"

  self.attrModel "world", World

  self.extend
    update: ->
      if I.step % 20 is 0
        self.world().entities().forEach (entity) ->
          entity.move(self.world())

      I.step += 1

  return self
