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
const gameInfo = document.getElementById('game__info')
console.log(gameInfo)
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

// GameInfo
function GameInfo(world) {
  this.world = world
  this.container = null
}

GameInfo.prototype.update = function () {
  const { legend, grid } = this.world
  let stats = {}
  for (let critter in legend) {
    stats[critter] = 0
  }
  grid.forEach(function (...rest) {
    const critter = rest[0]
    if (stats.hasOwnProperty(critter.originChar)) {
      stats[critter.originChar] += 1
    }
  }, null)
  if (!this.container) {
    this.container = document.getElementById('game__info')
  }
  if (this.container) {
    let inner = ''
    for (let key in stats) {
      inner += `<li>${key} : ${stats[key]}</li>`
    }
    this.container.innerHTML = `
      <ul>
        ${inner}
      </ul>
    `
  }
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
function World(map, legend, output) {
  console.log(output)
  var grid = new Grid(map[0].length, map.length);
  this.grid = grid;
  this.legend = legend;
  this.gameInfo = new GameInfo(this, output)

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
  this.gameInfo.update()
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

function LifelikeWorld(map, legend) {
  World.call(this, map, legend, document.getElementById('game__info'))
}

LifelikeWorld.prototype = Object.create(World.prototype)

// Убираем __proto__
let actionTypes = Object.create(null)

/**
 * Рост энергии
 */
actionTypes.grow = function (critter) {
  critter.energy += 0.5
  return true
}

/**
 * 1. Получаем вектор назначения
 * 2. Если ячейка пустая, либо у существа уже нет энергии возвращаем false
 * 3. Иначе уменьшая энергию на 1 и делаем смену позиций векторов в сетке
 */
actionTypes.move = function (critter, vector, action) {
  const dest = this.checkDestination(action, vector)
  if (dest == null ||
    critter.energy <= 1 ||
    this.grid.get(dest) != null) {
    return false
  }
  critter.energy -= 1
  this.grid.set(vector, null)
  this.grid.set(dest, critter)
  return true
}

/**
 *  1. Поглощаем объект с энергией и забираем энергию
 *  2. Объект удаляем из сетки
 */
actionTypes.eat = function (critter, vector, action) {
  const dest = this.checkDestination(action, vector)
  const atDest = dest != null && this.grid.get(dest)
  if (!atDest || atDest.energy == null) {
    return false
  }
  critter.energy += atDest.energy
  this.grid.set(dest, null)
  return true
}

/**
 * Существо размножается, если у него вдвое больше энергии
 */
actionTypes.reproduce = function (critter, vector, action) {
  const baby = elementFromChar(this.legend, critter.originChar)
  const dest = this.checkDestination(action, vector)
  if (dest == null ||
    critter.energy <= 2 * baby.energy ||
    this.grid.get(dest) != null) {
    return false
  }
  critter.energy -= 2 * baby.energy
  this.grid.set(dest, baby)
  return true
}

LifelikeWorld.prototype.letAct = function (critter, vector) {
  const action = critter.act(new View(this, vector))
  const handled = action &&
    action.type in actionTypes &&
    actionTypes[action.type].call(this, critter, vector, action)

  if (!handled) {
    critter.energy -= 0.2
    if (critter.energy <= 0) {
      this.grid.set(vector, null)
    }
  }
}

function Plant() {
  this.energy = 3 + Math.random() * 4
}

Plant.prototype.act = function (context) {
  if (this.energy > 15) {
    const space = context.find(' ')
    if (space) {
      return { type: 'reproduce', direction: space }
    }
  }
  if (this.energy < 20) {
    return { type: 'grow' }
  }
}

function PlantEater() {
  this.energy = 20
}

PlantEater.prototype.act = function (context) {
  const space = context.find(' ')
  if (this.energy > 60 && space) {
    return { type: 'reproduce', direction: space }
  }
  const plant = context.find('*')
  if (plant) {
    return { type: 'eat', direction: plant }
  }
  if (space) {
    return { type: 'move', direction: space }
  }
}

// 9.1
function SmartPlantEater() {
  this.energy = 30
  this.direction = randomElement(directionNames)
}

/**
 * 1. Увеличиваем количество потребляемой энергии на размножение
 * 2. Находим все растения, которые находятся вблизи существа
 * 3. Если кол-во больше 1, то выбираем рандомное направление
 * 4. Не выбираем новое нвправление, пока текущее дает нам пустую клетку
 */
SmartPlantEater.prototype.act = function (context) {
  const space = context.find(' ')
  if (this.energy > 90 && space) {
    return { type: 'reproduce', direction: space }
  }
  const plants = context.findAll('*')
  if (plants.length > 1) {
    return { type: 'eat', direction: randomElement(plants) }
  }
  if (space) {
    const ch = context.look(this.direction)
    this.direction = ch === ' ' ? this.direction : space
    return { type: 'move', direction: this.direction }
  }
}

// 9.2


// const world = new World(plan, { '#': Wall, 'o': BouncingCritter })
var valley = new LifelikeWorld(
  ["############################",
    "#####                 ######",
    "##   ***                **##",
    "#   *##**         **  O  *##",
    "#    ***     O    ##**    *#",
    "#       O         ##***    #",
    "#                 ##**     #",
    "#   O       #*             #",
    "#*          #**       O    #",
    "#***        ##**    O    **#",
    "##****     ###***       *###",
    "############################"],
  {
    "#": Wall,
    "O": SmartPlantEater,
    "*": Plant
  }
);

function Tiger() {
  this.energy = 100;
  this.direction = "w";
  // Сохраняем кол-во замеченной добычи за ход на протяжении 6ти ходов
  this.preySeen = [];
}

Tiger.prototype.act = function (view) {
  // Среднее кол-во замеченной добычи за ход
  var seenPerTurn = this.preySeen.reduce(function (a, b) {
    return a + b;
  }, 0) / this.preySeen.length;
  var prey = view.findAll("O");
  this.preySeen.push(prey.length);
  // Удаляем первый элемент из массива если его длина больше 6
  if (this.preySeen.length > 6)
    this.preySeen.shift();
  // Съедаем добычу, если вероятность больше 1/4
  if (prey.length && seenPerTurn > 0.25)
    return { type: "eat", direction: randomElement(prey) };

  var space = view.find(" ");
  if (this.energy > 400 && space)
    return { type: "reproduce", direction: space };
  if (view.look(this.direction) != " " && space)
    this.direction = space;
  return { type: "move", direction: this.direction };
}


const world = new LifelikeWorld(
  ["####################################################",
    "#                 ####         ****              ###",
    "#   *  @  ##                 ########       OO    ##",
    "#   *    ##        O O                 ****       *#",
    "#       ##*                        ##########     *#",
    "#      ##***  *         ****                     **#",
    "#* **  #  *  ***      #########                  **#",
    "#* **  #      *               #   *              **#",
    "#     ##              #   O   #  ***          ######",
    "#*            @       #       #   *        O  #    #",
    "#*                    #  ######                 ** #",
    "###          ****          ***                  ** #",
    "#       O                        @         O       #",
    "#   *     ##  ##  ##  ##               ###      *  #",
    "#   **         #              *       #####  O     #",
    "##  **  O   O  #  #    ***  ***        ###      ** #",
    "###               #   *****                    ****#",
    "####################################################"],
  {
    "#": Wall,
    "@": Tiger,
    "O": SmartPlantEater, // from previous exercise
    "*": Plant
  }
)
