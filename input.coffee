module.exports = ->
  active = false
  
  document.addEventListener "mousedown", (e) ->
    console.log e
    active = true

  document.addEventListener "mousemove", (e) ->
    if active
      console.log e

  document.addEventListener "mouseup", (e) ->
    console.log e
    active = false
