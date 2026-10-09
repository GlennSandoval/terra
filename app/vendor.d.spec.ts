import type seedrandom from 'seedrandom';

type Assert<T extends true> = T;
export type SeedrandomContract = Assert<
  typeof seedrandom extends (seed: string) => () => number ? true : false
>;
