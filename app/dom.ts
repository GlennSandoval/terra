// Creates an HD canvas element on page and
// returns a reference to the element
import type {Color} from './types';
const createCanvasElement = (
  width: number,
  height: number,
  cellSize: number,
  id?: string,
  insertAfter?: Element,
  background?: Color,
): HTMLCanvasElement => {
  width *= cellSize;
  height *= cellSize;

  // Creates a scaled-up canvas based on the device's
  // resolution, then displays it properly using styles
  function createHDCanvas() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Unable to create a 2D canvas context.');

    // Creates a dummy canvas to test device's pixel ratio
    const context = document.createElement('canvas').getContext('2d');
    if (!context) throw new Error('Unable to create a 2D canvas context.');
    const ratio = (() => {
      const ctx = context as CanvasRenderingContext2D & {
        webkitBackingStorePixelRatio?: number;
        mozBackingStorePixelRatio?: number;
        msBackingStorePixelRatio?: number;
        oBackingStorePixelRatio?: number;
        backingStorePixelRatio?: number;
      };
      const dpr = window.devicePixelRatio || 1;
      const bsr =
        ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio ||
        1;
      return dpr / bsr;
    })();

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(ratio, ratio);
    ctx.font = `bold ${cellSize}px Arial`;

    if (id) canvas.id = id;
    if (background) canvas.style.background = `rgb(${background})`;

    return canvas;
  }

  const canvas = createHDCanvas();

  if (insertAfter) {
    const parent = insertAfter.parentNode;
    if (!parent) throw new Error('Cannot insert after an element without a parent.');
    parent.insertBefore(canvas, insertAfter.nextSibling);
  } else document.body.appendChild(canvas);

  return canvas;
};

export {createCanvasElement};
