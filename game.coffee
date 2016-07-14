Model = require "model"

World = require "./world"

module.exports = (I={}, self=Model(I)) ->
  defaults I,
    step: 0
    activeTool: "pan"

  self.attrObservable "activeTool", "tools", "inspectedCharacter"
  self.attrAccessor "viewport"
  self.attrAccessor "tiles"

  self.attrModel "world", World

  self.extend
    update: ->
      if I.step % 30 is 0
        self.world().entities().forEach (entity) ->
          entity.move(self.world())

      I.step += 1

  return self
