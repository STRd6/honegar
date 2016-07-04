CanvasRenderingContext2D::withTransform ?= (matrix, block) ->
  @save()

  @transform(
    matrix.a,
    matrix.b,
    matrix.c,
    matrix.d,
    matrix.tx,
    matrix.ty
  )

  try
    block(this)
  finally
    @restore()

  return this
