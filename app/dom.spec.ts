import {expect, test} from 'bun:test';
import {createCanvasElement} from './dom';

test('creates a scaled canvas, applies options, and appends it to the page', () => {
  const scales: number[][] = [];
  const appended: HTMLCanvasElement[] = [];
  const createElement = () =>
    ({
      width: 0,
      height: 0,
      style: {} as CSSStyleDeclaration,
      getContext: () => ({
        scale: (x: number, y: number) => scales.push([x, y]),
        webkitBackingStorePixelRatio: 1,
      }),
    }) as unknown as HTMLCanvasElement;
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: {
      createElement,
      body: {appendChild: (canvas: HTMLCanvasElement) => appended.push(canvas)},
    },
  });
  Object.defineProperty(globalThis, 'window', {configurable: true, value: {devicePixelRatio: 2}});

  const canvas = createCanvasElement(2, 3, 5, 'world', undefined, [1, 2, 3]);

  expect(canvas.width).toBe(20);
  expect(canvas.height).toBe(30);
  expect(canvas.style.width).toBe('10px');
  expect(canvas.style.height).toBe('15px');
  expect(canvas.style.background).toBe('rgb(1,2,3)');
  expect(canvas.id).toBe('world');
  expect(scales).toEqual([[2, 2]]);
  expect(appended).toEqual([canvas]);
});
