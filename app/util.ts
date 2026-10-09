import seedrandom from 'seedrandom';
import customLodash from '../lodash_custom/lodash.custom.min.js';
import type {NeighborCoordinates, WeightedCreature} from './types';

seedrandom('terra :)', {global: true});
const _ = customLodash._;

/**
 * Creates a function that returns a cell's neighbor coordinates.
 *
 * @param xMax - Grid width.
 * @param yMax - Grid height.
 * @param vonNeumann - Whether to use a von Neumann neighborhood instead of a Moore neighborhood.
 * @param periodic - Whether neighbor coordinates wrap at grid boundaries.
 * @returns A function that returns the neighbors around a cell for the supplied radius.
 */
_.getNeighborCoordsFn = (
  xMax: number,
  yMax: number,
  vonNeumann: boolean,
  periodic: boolean | undefined,
): NeighborCoordinates => {
  if (periodic) {
    if (vonNeumann) {
      // periodic von neumann
      return (x0, y0, radius) => {
        const coords = [];
        let x, rX, y, rY, rYMax;

        for (rX = -radius; rX <= radius; ++rX) {
          rYMax = radius - Math.abs(rX);
          for (rY = -rYMax; rY <= rYMax; ++rY) {
            x = (((rX + x0) % xMax) + xMax) % xMax;
            y = (((rY + y0) % yMax) + yMax) % yMax;
            if (x !== x0 || y !== y0) {
              coords.push({
                x: x,
                y: y,
              });
            }
          }
        }

        return coords;
      };
    } else {
      // periodic moore
      return (x0, y0, radius) => {
        const coords = [];
        let x, xLo, xHi, y, yLo, yHi;

        xLo = x0 - radius;
        yLo = y0 - radius;
        xHi = x0 + radius;
        yHi = y0 + radius;

        for (x = xLo; x <= xHi; ++x) {
          for (y = yLo; y <= yHi; ++y) {
            if (x !== x0 || y !== y0) {
              coords.push({
                x: ((x % xMax) + xMax) % xMax,
                y: ((y % yMax) + yMax) % yMax,
              });
            }
          }
        }

        return coords;
      };
    }
  } else {
    // non-periodic, need to restrict to within [0, max)
    xMax -= 1;
    yMax -= 1;

    if (vonNeumann) {
      //non-periodic von-neumann
      return (x0, y0, radius) => {
        const coords = [];
        let x, rX, y, rY, rYMax;

        for (rX = -radius; rX <= radius; ++rX) {
          rYMax = radius - Math.abs(rX);
          for (rY = -rYMax; rY <= rYMax; ++rY) {
            x = rX + x0;
            y = rY + y0;
            if (x >= 0 && y >= 0 && x <= xMax && y <= yMax && (x !== x0 || y !== y0)) {
              coords.push({
                x: x,
                y: y,
              });
            }
          }
        }

        return coords;
      };
    } else {
      // non-periodic moore
      return (x0, y0, radius) => {
        const coords = [];
        let x, xLo, xHi, y, yLo, yHi;

        xLo = Math.max(0, x0 - radius);
        yLo = Math.max(0, y0 - radius);
        xHi = Math.min(x0 + radius, xMax);
        yHi = Math.min(y0 + radius, yMax);

        for (x = xLo; x <= xHi; ++x)
          for (y = yLo; y <= yHi; ++y) if (x !== x0 || y !== y0) coords.push({x: x, y: y});

        return coords;
      };
    }
  }
};

_.pickRandomWeighted = (weightedArrays: WeightedCreature[]): string | false => {
  let sum = 0;
  const rand = _.random(100, true);
  for (let i = 0; i < weightedArrays.length; i++) {
    const cur = weightedArrays[i];
    sum += cur[1];
    if (sum > rand) return cur[0];
  }
  return false;
};

export default _;
