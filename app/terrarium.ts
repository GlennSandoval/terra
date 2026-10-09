import {getNeighborCoordsFn, pickRandomWeighted, random} from './util';
import factory from './creature';
import display from './display';
import {createCanvasElement} from './dom';
import type {
  Color,
  Coordinate,
  Creature,
  CreatureAction,
  Grid,
  Neighbor,
  NeighborCoordinates,
  WeightedCreature,
} from './types';

interface TerrariumOptions {
  id?: string;
  cellSize?: number;
  neighborhood?: string;
  neighbourhood?: string;
  trails?: number;
  background?: Color;
  insertAfter?: Element;
  periodic?: boolean;
}

type GridContent = string | string[][] | ((x: number, y: number) => string | false) | undefined;
type PendingGrid = Array<Array<CreatureAction[] | false>>;

interface TerrariumInstance {
  width: number;
  height: number;
  cellSize: number;
  trails: number | undefined;
  background: Color | undefined;
  canvas: HTMLCanvasElement;
  grid: Grid;
  nextFrame: number | false;
  hasChanged: boolean;
  getNeighborCoords: NeighborCoordinates;
  makeGrid(content?: GridContent): Grid;
  makeGridWithDistribution(distribution: WeightedCreature[]): Grid;
  step(steps?: number): Grid | false | undefined;
  draw(): void;
  animate(steps?: number | (() => void) | null, fn?: () => void): void;
  stop(): void;
  destroy(): void;
}

interface TerrariumConstructor {
  new (width: number, height: number, options?: TerrariumOptions | null): TerrariumInstance;
  prototype: TerrariumInstance;
}

/**
 * Creates a terrarium and its canvas.
 *
 * @param width - Number of cells along the x-axis; rounded up to an integer.
 * @param height - Number of cells along the y-axis; rounded up to an integer.
 * @param options - Optional canvas and neighborhood settings:
 *   - `id`: ID assigned to the canvas.
 *   - `cellSize`: Pixel size of each cell; defaults to `10`.
 *   - `neighborhood` or `neighbourhood`: Use von Neumann neighbors when set to `"vonneumann"` (case-insensitive); otherwise use Moore neighbors.
 *   - `trails`: Expected trail persistence from `0` to `1`; nonzero values require `background`.
 *   - `background`: RGB background color, also used when drawing trails.
 *   - `insertAfter`: Element after which to insert the canvas; otherwise it is appended to the body.
 *   - `periodic`: Whether neighbor coordinates wrap at grid boundaries.
 */
const Terrarium: TerrariumConstructor = function (
  this: TerrariumInstance,
  width: number,
  height: number,
  options?: TerrariumOptions | null,
) {
  // cast width and height to integers
  width = Math.ceil(width);
  height = Math.ceil(height);

  // set default options
  options = options || {};
  const cellSize = options.cellSize || 10;
  let neighborhood = options.neighborhood || options.neighbourhood;
  if (typeof neighborhood === 'string') neighborhood = neighborhood.toLowerCase();

  this.width = width;
  this.height = height;
  this.cellSize = cellSize;
  this.trails = options.trails;
  this.background = options.background;
  this.canvas = createCanvasElement(
    width,
    height,
    cellSize,
    options.id,
    options.insertAfter,
    this.background,
  );
  this.grid = [];
  this.nextFrame = false;
  this.hasChanged = false;
  this.getNeighborCoords = getNeighborCoordsFn(
    width,
    height,
    neighborhood === 'vonneumann',
    options.periodic,
  );
} as unknown as TerrariumConstructor;

/**
 * Creates a grid populated from a coordinate callback, a row-major array, or one creature type.
 *
 * @param content - A callback returning a creature type or `false` for each `(x, y)`, an array indexed as
 *   `content[y][x]`, or a type name applied to every cell. Omitted content or unregistered type
 *   names leave cells empty.
 * @returns A grid indexed as `grid[x][y]`.
 */
Terrarium.prototype.makeGrid = function (this: TerrariumInstance, content?: GridContent): Grid {
  const grid: Grid = [];
  const width = this.width;
  for (let x = 0; x < width; x++) {
    grid.push([]);
    const height = this.height;
    for (let y = 0; y < height; y++) {
      let type: string | false | undefined;
      if (typeof content === 'function') {
        type = content(x, y);
      } else if (Array.isArray(content) && content.length) {
        type = content[y]?.[x];
      } else if (typeof content === 'string') {
        type = content;
      }
      grid[x].push(factory.make(type));
    }
  }
  return grid;
};

/**
 * Creates a grid by independently selecting a creature for each cell.
 *
 * @param distribution - `[type, weight]` pairs. Weights are cumulative percentage points on a
 *   `0`–`100` draw; totals below `100` leave the remaining cells empty.
 * @returns A grid indexed as `grid[x][y]`.
 */
Terrarium.prototype.makeGridWithDistribution = function (
  this: TerrariumInstance,
  distribution: WeightedCreature[],
): Grid {
  return this.makeGrid(() => pickRandomWeighted(distribution));
};

/**
 * Advances the simulation for up to the requested number of steps.
 *
 * @param steps - Nonnegative integer count; defaults to one when omitted. Zero runs no steps.
 * @returns The resulting grid, `false` if a step makes no changes, or `undefined` if no steps run.
 */
Terrarium.prototype.step = function (
  this: TerrariumInstance,
  steps?: number,
): Grid | false | undefined {
  function copyAndRemoveInner(origCreature: Creature | false): Creature | false {
    if (origCreature) {
      // Registered cells retain their concrete constructors when copied.
      const CreatureConstructor = origCreature.constructor as unknown as new () => Creature;
      const copy = Object.assign(new CreatureConstructor(), origCreature) as Creature & {
        age: number;
      };
      const dead = copy.isDead();
      if (dead && !self.hasChanged) self.hasChanged = true;
      copy.age++;

      return !dead ? copy : false;
    } else return false;
  }

  function copyAndRemove(origCols: Array<Creature | false>): Array<Creature | false> {
    return origCols.map(copyAndRemoveInner);
  }

  // TODO: Switch coords to just x and y to be consistent w/ pickWinnerInner
  function zipCoordsWithNeighbors(coords: Coordinate): Neighbor {
    return {
      coords: coords,
      creature: oldGrid[coords.x][coords.y],
    };
  }

  function processLoser(loser: Creature | CreatureAction): void {
    // Losers are either creatures or action records; preserve the legacy property probe.
    const action = loser as CreatureAction;
    const loserCreature = action.creature;
    if (loserCreature) {
      if (!loserCreature.failureFn) throw new Error('Creature action has no failure callback.');
      loserCreature.failureFn();
      loserCreature.boundEnergy();
    } else {
      const creature = loser as Creature;
      creature.wait();
      creature.boundEnergy();
    }
  }

  function processCreaturesInner(creature: Creature | false, x: number, y: number): void {
    if (creature) {
      const neighbors = self
        .getNeighborCoords(x, y, creature.actionRadius)
        .map(zipCoordsWithNeighbors);
      const result = creature.process(neighbors, x, y);
      if (typeof result === 'object') {
        const eigenColumn = eigenGrid[result.x];
        const returnedCreature = result.creature;
        const returnedY = result.y;

        let contenders = eigenColumn[returnedY];
        if (!contenders) {
          contenders = [];
          eigenColumn[returnedY] = contenders;
        }
        contenders.push({
          x: x,
          y: y,
          creature: returnedCreature,
        });
        if (!self.hasChanged && result.observed) self.hasChanged = true;
      } else {
        if (result && !self.hasChanged) self.hasChanged = true;
        processLoser(creature);
      }
    }
  }

  function processCreatures(column: Array<Creature | false>, x: number): void {
    column.forEach((creature: Creature | false, y: number) => {
      processCreaturesInner(creature, x, y);
    });
  }

  function pickWinnerInner(superposition: CreatureAction[] | false, x: number, y: number): void {
    if (superposition) {
      const winner = superposition.splice(Math.floor(random() * superposition.length), 1)[0];
      // Actions in this grid were emitted by live creatures.
      const winnerCreature = winner.creature as Creature;
      const nextGrid = newGrid;
      if (!nextGrid) throw new Error('Cannot select a winner before creating the next grid.');
      const successFn = winnerCreature.successFn;
      if (!successFn) throw new Error('Creature action has no success callback.');

      // clear the original creature's square if successFn returns false
      if (!successFn.call(winnerCreature)) {
        nextGrid[winner.x][winner.y] = false;
      }
      // TODO: so many calls to this. Can we just run it once at the start of a step?
      winnerCreature.boundEnergy();

      // put the winner in its rightful place
      nextGrid[x][y] = winnerCreature;

      // ...and call wait() on the losers. We can do this without
      // affecting temporal consistency because all callbacks have
      // already been created with prior conditions
      superposition.forEach(processLoser);
    }
  }

  function pickWinner(column: Array<CreatureAction[] | false>, x: number): void {
    column.forEach((superposition: CreatureAction[] | false, y: number) => {
      pickWinnerInner(superposition, x, y);
    });
  }

  const self = this;
  let oldGrid: Grid = this.grid;
  let newGrid: Grid | undefined;
  let eigenGrid: PendingGrid;
  if (typeof steps !== 'number') steps = 1;

  while (steps--) {
    this.hasChanged = false;

    oldGrid = newGrid ? newGrid.slice() : this.grid;

    // copy the old grid & remove dead creatures
    newGrid = oldGrid.map(copyAndRemove);

    // create an empty grid to hold creatures competing for the same square
    // This grid is reused as a matrix of contender lists during the simulation step.
    eigenGrid = this.makeGrid() as unknown as PendingGrid;

    // Add each creature's intended destination to the eigenGrid
    newGrid.forEach(processCreatures);

    // Choose a winner from each of the eigenGrid's superpositions
    eigenGrid.forEach(pickWinner);

    if (!this.hasChanged) return false;
  }

  return newGrid;
};

/** Updates the canvas to reflect the current grid. */
Terrarium.prototype.draw = function (this: TerrariumInstance): void {
  display(this.canvas, this.grid, this.cellSize, this.trails, this.background);
};

/**
 * Animates the simulation until it stops changing or reaches the step limit.
 *
 * @param steps - Positive integer step limit. Pass a callback here to run until the grid stops changing.
 * @param fn - Callback invoked when the animation stops.
 * @remarks Does nothing if an animation is already running.
 */
Terrarium.prototype.animate = function (
  this: TerrariumInstance,
  steps?: number | (() => void) | null,
  fn?: () => void,
): void {
  let i = 0;
  const self = this;

  function tick() {
    const grid = self.step();
    if (grid) {
      self.grid = grid;
      self.draw();
      if (++i !== steps) return (self.nextFrame = requestAnimationFrame(tick));
    } // if grid hasn't changed || reached last step
    self.nextFrame = false;
    if (fn) fn();
  }

  if (typeof steps === 'function') {
    fn = steps;
    steps = null;
  }

  if (!this.nextFrame) {
    self.nextFrame = requestAnimationFrame(tick);
  }
};

/** Stops the currently running animation. */
Terrarium.prototype.stop = function (this: TerrariumInstance): void {
  cancelAnimationFrame(this.nextFrame || 0);
  this.nextFrame = false;
};

/** Stops the animation and removes the canvas from its parent element. */
Terrarium.prototype.destroy = function (this: TerrariumInstance): void {
  const canvas = this.canvas;
  this.stop();
  const parent = canvas.parentNode;
  if (!parent) throw new Error('Cannot destroy a canvas without a parent.');
  parent.removeChild(canvas);
};

export default Terrarium;
