import seedrandom from 'seedrandom';
import type {NeighborCoordinates, WeightedCreature} from './types';

export const random = seedrandom('terra :)');

/**
 * Creates a function that returns a cell's neighbor coordinates.
 *
 * @param xMax - Grid width.
 * @param yMax - Grid height.
 * @param vonNeumann - Whether to use a von Neumann neighborhood instead of a Moore neighborhood.
 * @param periodic - Whether neighbor coordinates wrap at grid boundaries.
 * @returns A function that returns the neighbors around a cell for the supplied radius.
 */
export const getNeighborCoordsFn = (
  xMax: number,
  yMax: number,
  vonNeumann: boolean,
  periodic: boolean | undefined,
): NeighborCoordinates => {
  if (vonNeumann) {
    if (periodic) {
      // Periodic von Neumann.
      return (x0, y0, radius) => {
        const coords = [];

        for (let rX = -radius; rX <= radius; ++rX) {
          const x = (((rX + x0) % xMax) + xMax) % xMax;
          const rYMax = radius - Math.abs(rX);
          for (let rY = -rYMax; rY <= rYMax; ++rY) {
            const y = (((rY + y0) % yMax) + yMax) % yMax;
            if (x !== x0 || y !== y0) coords.push({x, y});
          }
        }

        return coords;
      };
    }

    const xMaxIndex = xMax - 1;
    const yMaxIndex = yMax - 1;
    // Non-periodic von Neumann.
    return (x0, y0, radius) => {
      const coords = [];

      for (let rX = -radius; rX <= radius; ++rX) {
        const x = rX + x0;
        const rYMax = radius - Math.abs(rX);
        for (let rY = -rYMax; rY <= rYMax; ++rY) {
          const y = rY + y0;
          if (x >= 0 && y >= 0 && x <= xMaxIndex && y <= yMaxIndex && (x !== x0 || y !== y0)) {
            coords.push({x, y});
          }
        }
      }

      return coords;
    };
  }

  if (periodic) {
    // Periodic Moore.
    return (x0, y0, radius) => {
      const coords = [];
      const xLo = x0 - radius;
      const yLo = y0 - radius;
      const xHi = x0 + radius;
      const yHi = y0 + radius;

      for (let x = xLo; x <= xHi; ++x) {
        for (let y = yLo; y <= yHi; ++y) {
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

  const xMaxIndex = xMax - 1;
  const yMaxIndex = yMax - 1;
  // Non-periodic Moore.
  return (x0, y0, radius) => {
    const coords = [];
    const xLo = Math.max(0, x0 - radius);
    const yLo = Math.max(0, y0 - radius);
    const xHi = Math.min(x0 + radius, xMaxIndex);
    const yHi = Math.min(y0 + radius, yMaxIndex);

    for (let x = xLo; x <= xHi; ++x) {
      for (let y = yLo; y <= yHi; ++y) {
        if (x !== x0 || y !== y0) coords.push({x, y});
      }
    }

    return coords;
  };
};

export const pickRandomWeighted = (weightedArrays: WeightedCreature[]): string | false => {
  let sum = 0;
  const rand = random() * 100;
  for (let i = 0; i < weightedArrays.length; i++) {
    const cur = weightedArrays[i];
    sum += cur[1];
    if (sum > rand) return cur[0];
  }
  return false;
};
