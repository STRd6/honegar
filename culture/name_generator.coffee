AngloSaxon = require "./data/names/anglo-saxon"

rand = (array) ->
  index = Math.floor Math.random() * array.length

  array[index]

module.exports = ->
  generate: ->
    rand(AngloSaxon.male)[0]
    
