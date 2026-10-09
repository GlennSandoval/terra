import {afterEach, expect, test} from 'bun:test';
import Terrarium from './terrarium';
import factory from './creature';
import type {Creature} from './types';

const documentDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'document');
const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
afterEach(() => {
  if (documentDescriptor) Object.defineProperty(globalThis, 'document', documentDescriptor);
  else Reflect.deleteProperty(globalThis, 'document');
  if (windowDescriptor) Object.defineProperty(globalThis, 'window', windowDescriptor);
  else Reflect.deleteProperty(globalThis, 'window');
});

function installDom() {
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: {
      createElement: () => ({style: {}, getContext: () => ({scale() {}})}),
      body: {appendChild() {}},
    },
  });
  Object.defineProperty(globalThis, 'window', {configurable: true, value: {devicePixelRatio: 1}});
}

test('constructor rounds dimensions and makeGrid resolves content by coordinates', () => {
  installDom();
  const type = 'terrarium.spec.grid';
  factory.registerCA({type, color: [1, 2, 3]});
  const terrarium = new Terrarium(2.2, 1.1, {cellSize: 4, neighborhood: 'VONNEUMANN'});

  expect(terrarium.width).toBe(3);
  expect(terrarium.height).toBe(2);
  expect(terrarium.canvas.width).toBe(12);
  expect(terrarium.canvas.height).toBe(8);
  expect(terrarium.getNeighborCoords(0, 0, 1)).toEqual([
    {x: 0, y: 1},
    {x: 1, y: 0},
  ]);
  const callbackOrder: Array<[number, number]> = [];
  const grid = terrarium.makeGrid((x, y) => {
    callbackOrder.push([x, y]);
    if (x === 1 && y === 0) return type;
    if (x === 2 && y === 1) return false;
    return 'missing';
  });
  expect(callbackOrder).toEqual([
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
    [2, 0],
    [2, 1],
  ]);
  expect(grid[1][0]).toMatchObject({type});
  expect(grid[0][0]).toBe(false);
  expect(grid[2][1]).toBe(false);
  const distributed = terrarium.makeGridWithDistribution([[type, 100]]);
  for (const column of distributed) {
    for (const cell of column) expect(cell).toMatchObject({type});
  }
});

test('makeGrid reads row-major arrays and leaves empty or missing rows empty', () => {
  installDom();
  const firstType = 'terrarium.spec.grid.row-major.first';
  const secondType = 'terrarium.spec.grid.row-major.second';
  factory.registerCA({type: firstType, color: [1, 2, 3]});
  factory.registerCA({type: secondType, color: [4, 5, 6]});
  const terrarium = new Terrarium(2, 3);

  const grid = terrarium.makeGrid([
    [firstType, secondType],
    [secondType, firstType],
    [firstType, secondType],
  ]);
  expect(grid[1][2]).toMatchObject({type: secondType});
  expect(grid[0][2]).toMatchObject({type: firstType});

  const partialGrid = terrarium.makeGrid([[firstType], []]);
  expect(partialGrid[0][0]).toMatchObject({type: firstType});
  expect(partialGrid[0].slice(1)).toEqual([false, false]);
  expect(partialGrid[1]).toEqual([false, false, false]);
});

test('empty and zero-weight distributions leave every grid cell empty', () => {
  installDom();
  const type = 'terrarium.spec.grid.zero-weight';
  factory.registerCA({type, color: [1, 2, 3]});
  const terrarium = new Terrarium(2, 3);

  expect(terrarium.makeGridWithDistribution([])).toEqual([
    [false, false, false],
    [false, false, false],
  ]);
  expect(terrarium.makeGridWithDistribution([[type, 0]])).toEqual([
    [false, false, false],
    [false, false, false],
  ]);
});

test('step moves an observed creature action and leaves the origin empty', () => {
  installDom();
  const type = 'terrarium.spec.move';
  factory.registerCA({
    type,
    color: [1, 2, 3],
    successFn: () => false,
    failureFn: () => true,
    process: function (this: Creature) {
      return {x: 1, y: 0, creature: this, observed: true};
    },
  });
  const terrarium = new Terrarium(2, 1);
  terrarium.grid = terrarium.makeGrid([[type, '']]);

  const next = terrarium.step();
  if (next === false || next === undefined) throw new Error('step did not produce a changed grid');
  expect(next[0][0]).toBe(false);
  expect(next[1][0]).toMatchObject({type});
});

test('step returns false when no creature changes the grid', () => {
  installDom();
  const type = 'terrarium.spec.stable';
  factory.registerCA({type, color: [1, 2, 3], process: () => undefined});
  const terrarium = new Terrarium(1, 1);
  terrarium.grid = terrarium.makeGrid(type);

  expect(terrarium.step()).toBe(false);
});
