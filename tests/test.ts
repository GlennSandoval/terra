import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {test} from 'bun:test';

test('package entry rejects duplicate creature types', () => {
  const terra = require('..');
  assert.equal(terra.registerCA({type: 'alive', color: [0, 0, 0]}), true);
  assert.equal(terra.registerCA({type: 'alive', color: [0, 0, 0]}), false);
});

test('browser bundle applies periodic boundaries to von Neumann neighbors', () => {
  const context = {
    document: {
      createElement: () => ({
        style: {},
        getContext: () => ({scale() {}}),
      }),
      body: {appendChild() {}},
    },
    devicePixelRatio: 1,
    window: undefined as unknown,
  };
  context.window = context;
  runInNewContext(readFileSync('dist/terra.min.js', 'utf8'), context);
  const browser = context.window as {
    terra: {
      Terrarium: new (
        width: number,
        height: number,
        options: {neighborhood: string; periodic: boolean},
      ) => {
        getNeighborCoords: (
          x: number,
          y: number,
          radius: number,
        ) => Iterable<{x: number; y: number}>;
      };
    };
  };
  const grid = new browser.terra.Terrarium(3, 3, {
    neighborhood: 'vonneumann',
    periodic: true,
  });
  const neighbors = Array.from(grid.getNeighborCoords(0, 0, 1), ({x, y}) => `${x},${y}`);
  assert.deepEqual(neighbors.sort(), ['0,1', '0,2', '1,0', '2,0']);
});
