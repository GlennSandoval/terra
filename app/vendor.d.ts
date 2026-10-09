declare module 'seedrandom' {
  const seedrandom: (seed: string, options: {global: boolean}) => unknown;
  export default seedrandom;
}

declare module '*.custom.min.js' {
  import type {LodashSubset} from './types';
  const bundle: {_: LodashSubset};
  export default bundle;
}
