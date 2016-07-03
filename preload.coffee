Ajax = require "ajax"
ajax = Ajax()

basePath = "https://danielx.whimsy.space/DawnLike/"

module.exports = 
  image: (name) ->
    ajax.getBlob("#{basePath}#{name}.png?o_0")
    .then (blob) ->
      new Promise (resolve, reject) ->
        img = new Image
        img.onload = ->
          resolve(img)
        img.onerror = reject
        img.src = URL.createObjectURL(blob)
