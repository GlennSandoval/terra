import {expect, test} from 'bun:test';
import {getNeighborCoordsFn, pickRandomWeighted} from './util';

test('von Neumann neighbors stay inside non-periodic bounds', () => {
  const neighbors = getNeighborCoordsFn(3, 3, true, false)(0, 0, 1);
  expect(neighbors).toEqual([
    {x: 0, y: 1},
    {x: 1, y: 0},
  ]);
});

test('periodic Moore neighbors wrap across grid edges', () => {
  const neighbors = getNeighborCoordsFn(3, 3, false, true)(0, 0, 1);
  expect(neighbors).toContainEqual({x: 2, y: 2});
  expect(neighbors).toContainEqual({x: 0, y: 2});
  expect(neighbors).toContainEqual({x: 2, y: 0});
});

test('weighted selection handles a certain choice and an empty distribution', () => {
  expect(pickRandomWeighted([['only', 100]])).toBe('only');
  expect(pickRandomWeighted([])).toBe(false);
});
