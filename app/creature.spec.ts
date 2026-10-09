import {expect, test} from 'bun:test';
import factory from './creature';
import type {Creature} from './types';

function makeProcessCreature(type: string): Creature {
  if (!factory.registerCreature({type, color: [1, 2, 3]})) {
    throw new Error(`could not register test creature ${type}`);
  }
  const creature = factory.make(type);
  if (creature === false) throw new Error(`could not create test creature ${type}`);
  return creature;
}

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

test('process prefers reproduction and treats thresholds as strict', () => {
  const parent = makeProcessCreature('creature.spec.process.precedence');
  parent.energy = 90;
  parent.maxEnergy = 100;
  parent.reproduceLv = 0.7;
  parent.moveLv = 0.5;
  const calls: string[] = [];
  parent.reproduce = () => {
    calls.push('reproduce');
    return {x: 1, y: 0, creature: parent};
  };
  parent.move = () => {
    calls.push('move');
    return {x: 0, y: 1, creature: parent};
  };

  expect(parent.process([], 0, 0)).toMatchObject({x: 1, y: 0, creature: parent, observed: true});
  expect(calls).toEqual(['reproduce']);

  const equalThreshold = makeProcessCreature('creature.spec.process.strict-reproduction');
  equalThreshold.energy = 70;
  equalThreshold.maxEnergy = 100;
  equalThreshold.reproduceLv = 0.7;
  equalThreshold.moveLv = 0.5;
  const equalCalls: string[] = [];
  equalThreshold.reproduce = () => {
    equalCalls.push('reproduce');
    return false;
  };
  equalThreshold.move = () => {
    equalCalls.push('move');
    return {x: 1, y: 0, creature: equalThreshold};
  };

  expect(equalThreshold.process([], 0, 0)).toMatchObject({
    x: 1,
    y: 0,
    creature: equalThreshold,
    observed: true,
  });
  expect(equalCalls).toEqual(['move']);
});

test('failed reproduction does not fall back to movement', () => {
  const parent = makeProcessCreature('creature.spec.process.failed-reproduction');
  parent.energy = 90;
  parent.maxEnergy = 100;
  parent.reproduceLv = 0.7;
  parent.moveLv = 0.1;
  const calls: string[] = [];
  parent.reproduce = () => {
    calls.push('reproduce');
    return false;
  };
  parent.move = () => {
    calls.push('move');
    return {x: 1, y: 0, creature: parent};
  };

  expect(parent.process([], 0, 0)).toBe(true);
  expect(calls).toEqual(['reproduce']);
});

test('movement installs action callbacks on the returned creature', () => {
  const parent = makeProcessCreature('creature.spec.process.move-callbacks');
  const child = makeProcessCreature('creature.spec.process.move-callbacks-child');
  parent.energy = 60;
  parent.maxEnergy = 100;
  parent.reproduceLv = 0.7;
  parent.moveLv = 0.5;
  let reproductionCalls = 0;
  const successCallback = function successCallback() {
    return true;
  };
  const failureCallback = function failureCallback() {
    return false;
  };
  parent.reproduce = () => {
    reproductionCalls++;
    return false;
  };
  parent.move = () => {
    return {
      x: 2,
      y: 3,
      creature: child,
      successFn: successCallback,
      failureFn: failureCallback,
    };
  };

  expect(parent.process([], 0, 0)).toMatchObject({x: 2, y: 3, creature: child, observed: true});
  expect(reproductionCalls).toBe(0);
  expect(child.successFn).toBe(successCallback);
  expect(child.failureFn).toBe(failureCallback);
});

test('process defaults missing action callbacks to the returned creature wait method', () => {
  const parent = makeProcessCreature('creature.spec.process.default-callbacks');
  const child = makeProcessCreature('creature.spec.process.default-callbacks-child');
  parent.energy = 60;
  parent.maxEnergy = 100;
  parent.reproduceLv = 0.7;
  parent.moveLv = 0.5;
  parent.move = () => {
    return {x: 1, y: 0, creature: child};
  };
  const wait = child.wait;

  expect(parent.process([], 0, 0)).toMatchObject({x: 1, y: 0, creature: child, observed: true});
  expect(child.successFn).toBe(wait);
  expect(child.failureFn).toBe(wait);
});

test('process returns the energy-versus-maximum fallback when no threshold qualifies', () => {
  const belowMaximum = makeProcessCreature('creature.spec.process.no-action-changed');
  belowMaximum.energy = 50;
  belowMaximum.maxEnergy = 100;
  belowMaximum.reproduceLv = 0.8;
  belowMaximum.moveLv = 0.5;
  expect(belowMaximum.process([], 0, 0)).toBe(true);

  const atMaximum = makeProcessCreature('creature.spec.process.no-action-at-max');
  atMaximum.energy = 100;
  atMaximum.maxEnergy = 100;
  atMaximum.reproduceLv = 1.1;
  atMaximum.moveLv = 1;
  expect(atMaximum.process([], 0, 0)).toBe(false);
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
