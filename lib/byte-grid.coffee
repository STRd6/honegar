module.exports = ({width, height, data}) ->
  length = width * height

  data ?= new Uint8Array(length)

  self =
    region: (rect, iterator) ->
      xStart = rect.x
      yStart = rect.y

      y = 0
      while y < rect.height
        x = 0
        while x < rect.width
          xPosition = x + xStart
          yPosition = y + yStart
          iterator self.get(xPosition, yPosition), xPosition, yPosition
          x += 1
        y += 1

      return self

    get: (x, y) ->
      if 0 <= x < width and 0 <= y < height
        data[y * width + x]

    set: (x, y, value) ->
      if 0 <= x < width and 0 <= y < height
        data[y * width + x] = value
      else
        throw new Error "index out of bounds"

    data: data
