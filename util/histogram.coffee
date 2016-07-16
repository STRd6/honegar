module.exports = 
  histogram: (data, opts={}) ->
    {min, max, bins} = opts
    min ?= 0
    max ?= 256
    bins ?= 16

    range = max - min
    counts = [0...bins].map ->
      0

    data.forEach (datum) ->
      n = Math.floor datum / range * counts.length
      counts[n]++

    counts

  spark:(data) ->
    bars = " ▁▂▃▄▅▆▇█".split("")

    {min, max} = data.extremes()
    countRange = max - min + 1
    graph = data.map (value) ->
      n = Math.floor (value - min) / countRange * bars.length
      bars[n]
    .join("")

    console.log "0 #{graph} 255"
