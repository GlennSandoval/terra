import {expect, test} from 'bun:test';
import display from './display';
import type {Creature, Grid} from './types';

test('clears the canvas and renders creature cells at their grid positions', () => {
  const cleared: number[][] = [];
  const rectangles: number[][] = [];
  const text: Array<[string, number, number]> = [];
  const context = {
    fillStyle: '',
    clearRect: (...args: number[]) => cleared.push(args),
    fillRect: (...args: number[]) => rectangles.push(args),
    fillText: (value: string, x: number, y: number) => text.push([value, x, y])
  } as unknown as CanvasRenderingContext2D;
  const canvas = {width: 20, height: 10, getContext: () => context} as unknown as HTMLCanvasElement;
  const grid = [
    [{type: 'red', color: [255, 0, 0], energy: 50, maxEnergy: 100, actionRadius: 1} as Creature],
    [{type: 'glyph', color: [0, 255, 0], character: 'X', actionRadius: 1} as Creature]
  ] as Grid;

  display(canvas, grid, 5, undefined, undefined);

  expect(cleared).toEqual([[0, 0, 20, 10]]);
  expect(rectangles).toEqual([[0, 0, 5, 5]]);
  expect(text).toEqual([['X', 5, 5]]);
});

test('trails require a background color', () => {
  const canvas = {getContext: () => ({})} as unknown as HTMLCanvasElement;
  expect(() => display(canvas, [], 1, 0.5, undefined)).toThrow('Background must also be set for trails');
});
