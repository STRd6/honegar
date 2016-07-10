AngloSaxon = require "./data/names/anglo-saxon"
Cities = require "./data/cities/ca"

rand = (array) ->
  index = Math.floor Math.random() * array.length

  array[index]

module.exports = ->
  generate: ->
    rand(AngloSaxon.male)[0]

  randomCity: ->
    rand(Cities)
