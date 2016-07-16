module.exports = (data) ->
  range = 256
  bars = " ▁▂▃▄▅▆▇█".split("")

  counts = [0...16].map -> 
    0

  data.forEach (datum) ->
    n = Math.floor datum / range * counts.length
    counts[n]++

  {min, max} = counts.extremes()
  countRange = max - min + 1
  graph = counts.map (count) ->
    n = Math.floor (count - min) / countRange * bars.length
    bars[n]
  .join("")

  console.log "0 #{graph} 255"
