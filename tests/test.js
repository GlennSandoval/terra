const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('bun:test').test;

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
        getContext: () => ({scale() {}})
      }),
      body: {appendChild() {}}
    },
    devicePixelRatio: 1
  };
  context.window = context;
  vm.runInNewContext(fs.readFileSync('dist/terra.min.js', 'utf8'), context);
  const grid = new context.window.terra.Terrarium(3, 3, {
    neighborhood: 'vonneumann',
    periodic: true
  });
  const neighbors = Array.from(grid.getNeighborCoords(0, 0, 1), ({x, y}) => `${x},${y}`);
  assert.deepEqual(neighbors.sort(), ['0,1', '0,2', '1,0', '2,0']);
});