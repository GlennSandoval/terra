export interface Coordinate {
  x: number;
  y: number;
}

export type Color = string | number[];

export interface Neighbor {
  coords: Coordinate;
  creature: Creature | false;
}

export interface CreatureAction {
  x: number;
  y: number;
  creature: Creature | false;
  successFn?: () => boolean | undefined;
  failureFn?: () => boolean | undefined;
  observed?: boolean;
}

export interface Creature {
  type: string;
  energy?: number;
  maxEnergy?: number;
  initialEnergy?: number;
  efficiency?: number;
  size?: number;
  actionRadius: number;
  sustainability?: number;
  reproduceLv?: number;
  moveLv?: number;
  color: Color;
  colorFn?: () => string;
  character?: string;
  successFn?: () => boolean | undefined;
  failureFn?: () => boolean | undefined;
  reproduce?(neighbors: Neighbor[]): CreatureAction | false;
  move?(neighbors: Neighbor[]): CreatureAction | false;
  boundEnergy(): void;
  isDead(): boolean;
  process(neighbors: Neighbor[], x: number, y: number): CreatureAction | boolean | undefined;
  wait(): boolean | undefined;
  [property: string]: unknown;
}

export type Grid = Array<Array<Creature | false>>;

export interface CreatureOptions {
  type: string;
  color?: Color;
  colour?: Color;
  colorFn?: () => string;
  colourFn?: () => string;
  initialEnergy?: number;
  [property: string]: unknown;
}

export type CreatureInitializer = (this: Creature) => void;
export type WeightedCreature = [type: string, weight: number];
export type NeighborCoordinates = (x: number, y: number, radius: number) => Coordinate[];

export interface LodashSubset {
  random(max: number, floating?: boolean): number;
  filter<T>(collection: T[], predicate: (value: T) => unknown): T[];
  each<T>(collection: T[], iteratee: (value: T, index: number) => unknown): void;
  each<T>(collection: Record<string, T>, iteratee: (value: T, key: string) => unknown): void;
  map<T, Result>(collection: T[], iteratee: (value: T, index: number) => Result): Result[];
  assign<T extends object>(target: T, source: object): T;
  clone<T extends object>(value: T): T;
  getNeighborCoordsFn(
    xMax: number,
    yMax: number,
    vonNeumann: boolean,
    periodic: boolean | undefined,
  ): NeighborCoordinates;
  pickRandomWeighted(weightedArrays: WeightedCreature[]): string | false;
}
