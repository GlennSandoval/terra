import {expect, test} from 'bun:test';
import factory from './creature';
import type {Creature} from './types';

test('registered creatures initialize energy and enforce energy bounds', () => {
  const type = 'creature.spec.base';
  expect(factory.registerCreature({type, color: [1, 2, 3], initialEnergy: 60})).toBe(true);
  expect(factory.registerCreature({type, color: [1, 2, 3]})).toBe(false);

  const creature = factory.make(type);
  if (creature === false) throw new Error('registered creature was not created');
  expect(creature.energy).toBe(60);
  expect(creature.isDead()).toBe(false);
  creature.energy = 120;
  creature.boundEnergy();
  expect(creature.energy).toBe(100);
  expect(creature.wait()).toBe(true);
  expect(creature.energy).toBe(95);
});

test('reproduction creates a child and charges the parent on success', () => {
  const type = 'creature.spec.reproduction';
  factory.registerCreature({type, color: [1, 2, 3], initialEnergy: 40});
  const parent = factory.make(type);
  if (parent === false) throw new Error('registered creature was not created');
  parent.energy = 80;

  const reproduce = parent.reproduce;
  if (!reproduce) throw new Error('registered creature cannot reproduce');
  const action = reproduce.call(parent, [{coords: {x: 1, y: 0}, creature: false}]);
  if (action === false) throw new Error('reproduction did not produce an action');
  expect(action.x).toBe(1);
  expect(action.y).toBe(0);
  expect(action.creature).not.toBe(false);
  if (!action.successFn) throw new Error('reproduction action has no success callback');
  action.successFn.call(parent);
  expect(parent.energy).toBe(40);
});

test('registered cellular automata retain their initializer and never die', () => {
  const type = 'creature.spec.ca';
  expect(
    factory.registerCA({type, color: [4, 5, 6]}, function (this: Creature) {
      this.initialized = true;
    }),
  ).toBe(true);

  const cell = factory.make(type);
  if (cell === false) throw new Error('registered automaton was not created');
  expect(cell.initialized).toBe(true);
  expect(cell.isDead()).toBe(false);
  expect(factory.registerCA({type, color: [4, 5, 6]})).toBe(false);
});
