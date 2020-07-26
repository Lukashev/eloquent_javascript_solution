function ArraySeq(arr) {
  let index = 0
  return {
    next: function () {
      return { value: arr[index], done: !!!arr[index++] }
    },
  }
}

function RangeSeq(from, to) {
  return {
    next: function () {
      return { value: from++, done: from > to }
    },
  }
}

function logFive(sequence) {
  for (let i = 0; i < 5; i++) {
    const { value, done } = sequence.next()
    if (done) {
      break
    }
    console.log(value)
  }
}

logFive(new ArraySeq([1, 2, 3, 4, 5, 6, 7]))
logFive(new RangeSeq(100, 1000))
