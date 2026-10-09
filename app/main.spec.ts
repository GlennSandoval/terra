import {afterEach, expect, test} from 'bun:test';
import {registerCA, registerCreature, Terrarium} from './main';

const documentDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'document');
const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
afterEach(() => {
  if (documentDescriptor) Object.defineProperty(globalThis, 'document', documentDescriptor);
  else Reflect.deleteProperty(globalThis, 'document');
  if (windowDescriptor) Object.defineProperty(globalThis, 'window', windowDescriptor);
  else Reflect.deleteProperty(globalThis, 'window');
});

test('public registration exports populate Terrarium grids', () => {
  const creatureType = 'main.spec.creature';
  const caType = 'main.spec.ca';
  const createElement = () => ({style: {}, getContext: () => ({scale() {}})});
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: {createElement, body: {appendChild() {}}}
  });
  Object.defineProperty(globalThis, 'window', {configurable: true, value: {devicePixelRatio: 1}});

  expect(registerCreature({type: creatureType, color: [1, 2, 3], initialEnergy: 30})).toBe(true);
  expect(registerCA({type: caType, color: [4, 5, 6]})).toBe(true);
  const terrarium = new Terrarium(2, 1);
  const grid = terrarium.makeGrid((x) => x === 0 ? creatureType : caType);

  expect(grid[0][0]).toMatchObject({type: creatureType, energy: 30});
  expect(grid[1][0]).toMatchObject({type: caType});
});
