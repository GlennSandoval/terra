const terra = window.terra;

terra.registerCreature({
  type: 'simplePlant',
  color: [0, 120, 0],
  size: 10,
  initialEnergy: 5,
  maxEnergy: 20,
  move: false,
  reproduceLv: 0.65,
  wait() {
    this.energy += 1;
  },
});

terra.registerCreature({
  type: 'secondCreature',
  color: [120, 0, 240],
  sustainability: 6,
  reproduceLv: 1,
});

terra.registerCreature({
  type: 'plant',
  color: [0, 120, 0],
  size: 10,
  initialEnergy: 5,
  maxEnergy: 20,
  move: false,
  reproduceLv: 0.65,
  wait() {
    this.energy += 1;
  },
});

terra.registerCreature({
  type: 'brute',
  color: [0, 255, 255],
  maxEnergy: 50,
  initialEnergy: 10,
  size: 20,
});

terra.registerCreature({
  type: 'bully',
  color: [241, 196, 15],
  initialEnergy: 20,
  reproduceLv: 0.6,
  sustainability: 3,
});

terra.registerCA(
  {
    type: 'GoL',
    color: [255, 255, 255],
    colorFn() {
      return this.alive ? `${this.color},1` : '0,0,0,0';
    },
    process(neighbors) {
      const aliveNeighbors = neighbors.filter(({creature}) => creature?.alive).length;
      const nextAlive = aliveNeighbors === 3 || (this.alive && aliveNeighbors === 2);
      const changed = nextAlive !== this.alive;
      this.alive = nextAlive;
      return changed;
    },
  },
  function () {
    this.alive = Math.random() < 0.5;
  },
);

const cyclicColors = [
  '255,0,0,1',
  '255,96,0,1',
  '255,191,0,1',
  '223,255,0,1',
  '128,255,0,1',
  '32,255,0,1',
  '0,255,64,1',
  '0,255,159,1',
  '0,255,255,1',
  '0,159,255,1',
  '0,64,255,1',
  '32,0,255,1',
  '127,0,255,1',
  '223,0,255,1',
  '255,0,191,1',
  '255,0,96,1',
];

terra.registerCA(
  {
    type: 'cyclic',
    colors: cyclicColors,
    colorFn() {
      return this.colors[this.state];
    },
    process(neighbors) {
      const nextState = (this.state + 1) % this.colors.length;
      const changes = neighbors.some(({creature}) => creature?.state === nextState);
      if (!changes) return false;
      this.state = nextState;
      return true;
    },
  },
  function () {
    this.state = Math.floor(Math.random() * cyclicColors.length);
  },
);

function makeTerrarium(width, height, id, targetId, options = {}) {
  const target = document.getElementById(targetId);
  if (!target) throw new Error(`Missing canvas target: ${targetId}`);

  return new terra.Terrarium(width, height, {
    ...options,
    id,
    insertAfter: target,
  });
}

function runSimulation(simulation, controlId, label, stepLimit, canvasClass = 'demo-canvas') {
  const button = document.getElementById(controlId);
  if (!button) throw new Error(`Missing simulation control: ${controlId}`);

  const canvas = simulation.canvas;
  canvas.className = canvasClass;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', label);
  button.setAttribute('aria-controls', canvas.id);

  if (canvasClass === 'hero-canvas') {
    canvas.style.width = '100%';
    canvas.style.height = '100%';
  } else {
    canvas.style.maxWidth = '100%';
    canvas.style.height = 'auto';
  }

  let running = false;

  function start() {
    running = true;
    button.textContent = 'Pause';
    simulation.animate(stepLimit, () => {
      running = false;
      button.textContent = 'Resume';
    });
  }

  button.addEventListener('click', () => {
    if (running) {
      simulation.stop();
      running = false;
      button.textContent = 'Resume';
    } else {
      start();
    }
  });

  simulation.draw();
  start();
}

const hero = makeTerrarium(
  Math.ceil(window.innerWidth / 10),
  Math.ceil(window.innerHeight / 10),
  'topTerrarium',
  'heroCanvas',
  {cellSize: 10, periodic: true, background: [12, 24, 32]},
);
hero.grid = hero.makeGridWithDistribution([
  ['plant', 70],
  ['brute', 20],
  ['bully', 10],
]);
runSimulation(hero, 'heroControl', 'Brutes and bullies simulation', undefined, 'hero-canvas');

const ex1 = makeTerrarium(25, 25, 'ex1', 'ex1Canvas');
ex1.grid = ex1.makeGridWithDistribution([
  ['secondCreature', 10],
  ['simplePlant', 90],
]);
runSimulation(ex1, 'ex1Control', 'Creature behavior example', 300);

const gameOfLife = makeTerrarium(25, 25, 'golTerrarium', 'lifeCanvas', {periodic: true});
gameOfLife.grid = gameOfLife.makeGrid('GoL');
runSimulation(gameOfLife, 'lifeControl', "Conway's Game of Life");

const cyclic = makeTerrarium(50, 50, 'cyclicTerrarium', 'cyclicCanvas', {
  cellSize: 6,
  periodic: true,
});
cyclic.grid = cyclic.makeGrid('cyclic');
runSimulation(cyclic, 'cyclicControl', 'Cyclic cellular automaton');

const bullies = makeTerrarium(25, 25, 'wbTerrarium', 'bulliesCanvas');
bullies.grid = bullies.makeGridWithDistribution([
  ['plant', 50],
  ['brute', 5],
  ['bully', 5],
]);
runSimulation(bullies, 'bulliesControl', 'Brutes and bullies');
