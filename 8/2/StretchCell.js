function StretchCell(inner, width, height) {
  this.inner = inner
  this.width = width
  this.height = height
}

StretchCell.prototype.minWidth = function () {
  return Math.max(this.width, this.inner.minWidth())
}
StretchCell.prototype.minHeight = function () {
  return Math.max(this.height, this.inner.minHeight())
}
StretchCell.prototype.draw = function (width, height) {
  return this.inner.draw(width, height)
}

module.exports = StretchCell
