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
    value: {createElement: () => ({style: {}, getContext: () => ({scale() {}})}), body: {appendChild() {}}}
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
  expect(terrarium.getNeighborCoords(0, 0, 1)).toEqual([{x: 0, y: 1}, {x: 1, y: 0}]);
  const grid = terrarium.makeGrid((x, y) => x === 1 && y === 0 ? type : 'missing');
  expect(grid[1][0]).toMatchObject({type});
  expect(grid[0][0]).toBe(false);
  expect(terrarium.makeGridWithDistribution([[type, 100]]).flat().every((cell) => cell !== false)).toBe(true);
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
    }
  });
  const terrarium = new Terrarium(2, 1);
  terrarium.grid = terrarium.makeGrid(type);

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
