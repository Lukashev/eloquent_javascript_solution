var MOUNTAINS = [
  { name: "Kilimanjaro", height: 5895, country: "Tanzania" },
  { name: "Everest", height: 8848, country: "Nepal" },
  { name: "Mount Fuji", height: 3776, country: "Japan" },
  { name: "Mont Blanc", height: 4808, country: "Italy/France" },
  { name: "Vaalserberg", height: 323, country: "Netherlands" },
  { name: "Denali", height: 6168, country: "United States" },
  { name: "Popocatepetl", height: 5465, country: "Mexico" },
]

/**
 * @summary  Метод draw использует для создания отступов в строках, чтобы они все были необходимой длины.
 * @param {*} string
 * @param {*} times
 */
function repeat(string, times) {
  var result = ""
  for (var i = 0; i < times; i++) result += string
  return result
}

if (typeof module != "undefined" && module.exports) {
  module.exports = {
    MOUNTAINS,
    repeat,
  }
}
