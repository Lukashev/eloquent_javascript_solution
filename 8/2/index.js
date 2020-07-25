var TextCell = require("./TextCell")
var RTextCell = require("./RTextCell")
var UnderlinedCell = require("./UnderlinedCell")
var StretchCell = require("./StretchCell")
var { MOUNTAINS } = require("./utils")

/**
 * @summary Dычисляет массивы минимальных высот строк для матрицы ячеек. Каждый внутренний массив - строка ячеек
 * @param {Array.<Array.<string>>} rows - Массив массивов
 */
function rowHeights(rows) {
  return rows.map(function (row) {
    return row.reduce(function (max, cell) {
      return Math.max(max, cell.minHeight())
    }, 0)
  })
}

/**
 * @summary Dычисляет массивы минимальных ширин колонок для матрицы ячеек. Каждый внутренний массив - строка ячеек
 * @param {Array.<Array.<string>>} rows - Массив массивов
 */
function colWidths(rows) {
  return rows[0].map(function (_, i) {
    return rows.reduce(function (max, row) {
      return Math.max(max, row[i].minWidth())
    }, 0)
  })
}

/**
 * @summary Вывод таблицы
 * @param {Array.<Array.<string>>} rows
 */
function drawTable(rows) {
  var heights = rowHeights(rows)
  var widths = colWidths(rows)
  /**
   * @summary Создает промежуток в один символ между столбцами таблицы
   * @param {*} blocks
   * @param {*} lineNo
   */
  function drawLine(blocks, lineNo) {
    return blocks
      .map(function (block) {
        return block[lineNo]
      })
      .join(" ")
  }
  /**
   *
   * @param {*} row - строка символов
   * @param {*} rowNum - индекс строки
   */
  function drawRow(row, rowNum) {
    var blocks = row.map(function (cell, colNum) {
      return cell.draw(widths[colNum], heights[rowNum])
    })
    return blocks[0]
      .map(function (_, lineNo) {
        var line = drawLine(blocks, lineNo)
        return line
      })
      .join("\n")
  }
  return rows.map(drawRow).join("\n")
}

function dataTable(data) {
  var keys = Object.keys(data[0])
  var headers = keys.map(function (name) {
    return new UnderlinedCell(new TextCell(name))
  })
  var body = data.map(function (row) {
    return keys.map(function (name) {
      var value = row[name]
      if (typeof value == "number") return new RTextCell(String(value))
      else return new TextCell(String(value))
    })
  })
  return [headers].concat(body)
}

var rows = []
for (var i = 0; i < 5; i++) {
  var row = []
  for (var j = 0; j < 5; j++) {
    if ((j + i) % 2 == 0) row.push(new TextCell("##"))
    else row.push(new TextCell(" "))
  }
  rows.push(row)
}

console.log(drawTable(rows))
console.log(drawTable(dataTable(MOUNTAINS)))

var sc = new StretchCell(new TextCell("abc"), 1, 2)
console.log(sc.minWidth())
console.log(sc.minHeight())
console.log(sc.draw(4, 3))
