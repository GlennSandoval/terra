import _ from './util';
import type {Color, Creature, Grid} from './types';

export default function display(canvas: HTMLCanvasElement, grid: Grid, cellSize: number, trails: number | undefined, background: Color | undefined) {
  var ctx = canvas.getContext('2d')!;
  if (trails && background) {
    ctx.fillStyle = 'rgba(' + background + ',' + (1 - trails) + ')';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (trails) {
    throw "Background must also be set for trails";
  } else ctx.clearRect(0, 0, canvas.width, canvas.height);

  _.each(grid, function (column: Array<Creature | false>, x: number) {
    _.each(column, function (creature: Creature | false, y: number) {
      if (creature) {
        var color = creature.colorFn ?
          creature.colorFn() :
          String(creature.color) + ',' + creature.energy! / creature.maxEnergy!;

        ctx.fillStyle = 'rgba(' + color + ')';

        if (creature.character) {
          ctx.fillText(creature.character, x * cellSize, y * cellSize + cellSize);
        } else {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    });
  });
};
