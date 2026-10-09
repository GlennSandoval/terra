import type seedrandom from 'seedrandom';
import type customLodash from '../lodash_custom/lodash.custom.min.js';
import type {LodashSubset} from './types';

type Assert<T extends true> = T;
type SeedrandomContract = Assert<
  typeof seedrandom extends (seed: string, options: {global: boolean}) => unknown ? true : false
>;
type LodashContract = Assert<typeof customLodash._ extends LodashSubset ? true : false>;
