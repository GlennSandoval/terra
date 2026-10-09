import _ from './util';
import type {Color, Creature, Grid} from './types';

export default function display(
  canvas: HTMLCanvasElement,
  grid: Grid,
  cellSize: number,
  trails: number | undefined,
  background: Color | undefined,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Unable to create a 2D canvas context.');
  if (trails && background) {
    ctx.fillStyle = `rgba(${background},${1 - trails})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (trails) {
    throw 'Background must also be set for trails';
  } else ctx.clearRect(0, 0, canvas.width, canvas.height);

  _.each(grid, (column: Array<Creature | false>, x: number) => {
    _.each(column, (creature: Creature | false, y: number) => {
      if (creature) {
        const color = creature.colorFn
          ? creature.colorFn()
          : `${String(creature.color)},${Number(creature.energy) / Number(creature.maxEnergy)}`;

        ctx.fillStyle = `rgba(${color})`;

        if (creature.character) {
          ctx.fillText(creature.character, x * cellSize, y * cellSize + cellSize);
        } else {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    });
  });
}
