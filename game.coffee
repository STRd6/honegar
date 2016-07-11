Model = require "model"

module.exports = (I={}, self=Model(I)) ->
  self.attrObservable "activeTool", "tools"
  self.attrAccessor "viewport"

  return self
