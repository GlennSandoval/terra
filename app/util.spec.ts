import {expect, test} from 'bun:test';
import {getNeighborCoordsFn, pickRandomWeighted} from './util';

test('neighbor shapes preserve corner order, bounds, and wrapping', () => {
  expect(getNeighborCoordsFn(3, 3, true, false)(0, 0, 1)).toEqual([
    {x: 0, y: 1},
    {x: 1, y: 0},
  ]);
  expect(getNeighborCoordsFn(3, 3, false, false)(0, 0, 1)).toEqual([
    {x: 0, y: 1},
    {x: 1, y: 0},
    {x: 1, y: 1},
  ]);
  expect(getNeighborCoordsFn(3, 3, true, true)(0, 0, 1)).toEqual([
    {x: 2, y: 0},
    {x: 0, y: 2},
    {x: 0, y: 1},
    {x: 1, y: 0},
  ]);
  expect(getNeighborCoordsFn(3, 3, false, true)(0, 0, 1)).toEqual([
    {x: 2, y: 2},
    {x: 2, y: 0},
    {x: 2, y: 1},
    {x: 0, y: 2},
    {x: 0, y: 1},
    {x: 1, y: 2},
    {x: 1, y: 0},
    {x: 1, y: 1},
  ]);
});

test('zero-radius neighborhoods have no neighbors', () => {
  for (const vonNeumann of [true, false]) {
    for (const periodic of [true, false]) {
      expect(getNeighborCoordsFn(3, 3, vonNeumann, periodic)(1, 1, 0)).toEqual([]);
    }
  }
});

test('periodic neighborhoods preserve the distinct center rules on a 1x1 grid', () => {
  expect(getNeighborCoordsFn(1, 1, true, true)(0, 0, 1)).toEqual([]);
  expect(getNeighborCoordsFn(1, 1, false, true)(0, 0, 1)).toEqual([
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
  ]);
});

test('weighted selection handles a certain choice and an empty distribution', () => {
  expect(pickRandomWeighted([['only', 100]])).toBe('only');
  expect(pickRandomWeighted([])).toBe(false);
});
