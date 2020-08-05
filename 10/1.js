function MultiplicatorUnitFailure() {}

function primitiveMultiply(a, b) {
  if (Math.random() < 0.5) return a * b
  else throw new MultiplicatorUnitFailure()
}

function reliableMultiply(a, b) {
  try {
    return primitiveMultiply(a, b)
  } catch (e) {
    if (e.__proto__.constructor.name === "MultiplicatorUnitFailure") {
      return reliableMultiply(a, b)
    }
  }
}

console.log(reliableMultiply(8, 8))
// → 64
