const { repeat } = require("./utils")

function TextCell(text) {
  this.text = text.split("\n")
}
TextCell.prototype.minWidth = function () {
  return this.text.reduce(function (width, line) {
    return Math.max(width, line.length)
  }, 0)
}
TextCell.prototype.minHeight = function () {
  return this.text.length
}
TextCell.prototype.draw = function (width, height) {
  var result = []
  for (var i = 0; i < height; i++) {
    var line = this.text[i] || ""
    result.push(line + repeat(" ", width - line.length))
  }
  return result
}

module.exports = TextCell
