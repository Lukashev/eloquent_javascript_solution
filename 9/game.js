const plan = [
  "############################",
  "#      #    #      o      ##",
  "#                          #",
  "#          #####           #",
  "##         #   #    ##     #",
  "###           ##     #     #",
  "#           ###      #     #",
  "#   ####                   #",
  "#   ##       o             #",
  "# o  #         o       ### #",
  "#    #                     #",
  "############################",
];
const directions = {
  n: new Vector(0, -1),
  ne: new Vector(1, -1),
  e: new Vector(1, 0),
  se: new Vector(1, 1),
  s: new Vector(0, 1),
  sw: new Vector(-1, 1),
  w: new Vector(-1, 0),
  nw: new Vector(-1, -1),
};
const directionNames = "n ne e se s sw w nw".split(" ");

function elementFromChar(legend, ch) {
  if (ch == " ") return null;
  var element = new legend[ch]();
  element.originChar = ch;
  return element;
}

function charFromElement(element) {
  if (element == null)
    return " ";
  else
    return element.originChar;
}

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}


// Vector
function Vector(x, y) {
  this.x = x;
  this.y = y;
}
Vector.prototype.plus = function (vector) {
  return new Vector(this.x + vector.x, this.y + vector.y);
};

// Grid
function Grid(width, height) {
  this.space = new Array(width * height);
  this.width = width;
  this.height = height;
}
Grid.prototype.isInside = function (vector) {
  return (
    vector.x > 0 &&
    vector.x < this.width &&
    vector.y > 0 &&
    vector.y < this.height
  );
};
Grid.prototype.get = function (vector) {
  return this.space[vector.x + this.width * vector.y];
};
Grid.prototype.set = function (vector, value) {
  this.space[vector.x + this.width * vector.y] = value;
};
Grid.prototype.forEach = function (f, context) {
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      var value = this.space[x + y * this.width];
      if (value != null)
        f.call(context, value, new Vector(x, y));
    }
  }
};

// World
function World(map, legend) {
  var grid = new Grid(map[0].length, map.length);
  this.grid = grid;
  this.legend = legend;

  map.forEach(function (line, y) {
    for (var x = 0; x < line.length; x++)
      grid.set(new Vector(x, y), elementFromChar(legend, line[x]));
  });
}

World.prototype.toString = function () {
  let output = ''
  const { width, height } = this.grid
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const element = this.grid.get(new Vector(x, y))
      output += charFromElement(element)
    }
    output += '\n'
  }
  return output
}

World.prototype.turn = function () {
  let acted = []
  this.grid.forEach(function (critter, vector) {
    if (critter.act && acted.indexOf(critter) == -1) {
      acted.push(critter)
      this.letAct(critter, vector)
    }
  }, this)
}

World.prototype.letAct = function (critter, vector) {
  let action = critter.act(new View(this, vector))
  if (action && action.type === 'move') {
    const dest = this.checkDestination(action, vector)
    if (dest && this.grid.get(dest)) {
      this.grid.set(dest, critter)
      this.grid.set(vector, null)
    }
  }
}

World.prototype.checkDestination = function (action, vector) {
  if (directions.hasOwnProperty(action.direction)) {
    const dest = vector.plus(directions[action.direction])
    if (this.grid.isInside(dest)) {
      return dest
    }
  }
}

// Wall
function Wall() { }

// Bouncing Critter
function BouncingCritter() {
  this.direction = randomElement(directionNames);
};

BouncingCritter.prototype.act = function (view) {
  if (view.look(this.direction) != " ")
    this.direction = view.find(" ") || "s";
  return { type: "move", direction: this.direction }
};

// View
function View(world, vector) {
  this.world = world
  this.vector = vector
}
/**
 * @summary
 * 1. Получаем вектор места, на который хотим попасть
 * 2. Проверяем, находится ли он в пределах сетки
 * 3. Извлекаем символ из сетки
 * @param {String} строка направления
 * @returns {String} символ на конкретном шаге
 */
View.prototype.look = function (dir) {
  const target = this.vector.plus(directions[dir])
  if (this.world.grid.isInside(target)) {
    return charFromElement(this.world.grid.get(target))
  }
  return '#'
}
/**
 * @summary
 * 1. Проходимся по объекту направлений
 * 2. Проверяем, можем ли мы сделать ход
 * 3. Если можем, кладем направление в массив
 * @param {String} ch
 * @returns {Array<String>}
 */
View.prototype.findAll = function (ch) {
  let found = []
  for (let dir in directions) {
    if (this.look(dir) === ch) {
      found.push(dir)
    }
  }
  return found
}
/**
 * @summary
 * 1. Находим все допустимые направления
 * 2. Если массив пустой возвращаем null
 * 3. Выбираем одно рандомное направление для хода
 * @param {String} ch
 * @param {String}
 */
View.prototype.find = function (ch) {
  const found = this.findAll(ch)
  if (!found.length) return null
  return randomElement(found)
}


const world = new World(plan, { '#': Wall, 'o': BouncingCritter })



