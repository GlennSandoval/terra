import type seedrandom from 'seedrandom';

type Assert<T extends true> = T;
export type SeedrandomContract = Assert<
  typeof seedrandom extends (seed: string, options: {global: boolean}) => unknown ? true : false
>;
