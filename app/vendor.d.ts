declare module 'seedrandom' {
  const seedrandom: (seed: string) => () => number;
  export default seedrandom;
}
