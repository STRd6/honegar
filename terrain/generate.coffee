ByteGrid = require "../lib/byte-grid"

gaussianKernel = [0.006, 0.061, 0.242, 0.383, 0.242, 0.061, 0.006]

noiseFill = (buffer) ->
  length = buffer.length
  i = 0
  while i < length
    v = Math.floor Math.random() * 256
    buffer[i] = v
    i++

  return buffer

# Fill blur using a gaussian blur filter
gaussian = (grid) ->
  {data, width, height} = grid
  length = data.length

  swap = ByteGrid
    width: width
    height: height

  # Apply blur kernel horizontally then vertically
  i = 0
  y = 0
  while i < length
    x = i % width
    v = gaussianKernel.reduce (total, ratio, index) ->
      (grid.get(index - 3 + x, y) ? 128) * ratio + total
    , 0
    if x is width - 1
      y++
    # Copy into a new buffer
    swap.data[i] = v
    i++

  i = 0
  x = 0
  while i < length
    y = i % height
    v = gaussianKernel.reduce (total, ratio, index) ->
      (swap.get(x, index - 3 + y) ? 128) * ratio + total
    , 0
    if y is height - 1
      x++
    # Copy back to orig
    data[i] = v
    i++

  return grid

cellular = (grid) ->

diamondSquare = (grid) -> # TODO
  {width, height} = grid

  stride = height

  # Initialize corners, assume wrap around
  grid.set(0, 0, 128)
  grid.set(0, stride - 1, 128)

  # Diamond
  grid.set(stride/2, stride/2, 128 + rand(128) - 64)

  # Square
  grid.set(stride/2, 0, )

module.exports =
  gaussian: gaussian
  noise: (grid) ->
    noiseFill(grid.data)
