import type {
  Color,
  Coordinate,
  Creature,
  Neighbor,
  NeighborCoordinates,
  WeightedCreature,
} from './types';

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? (<T>() => T extends B ? 1 : 2) extends <T>() => T extends A ? 1 : 2
      ? true
      : false
    : false;
type Assert<T extends true> = T;

type ColorContract = Assert<Equal<Color, string | number[]>>;
type CoordinateContract = Assert<Equal<Coordinate, {x: number; y: number}>>;
type NeighborContract = Assert<Equal<Neighbor, {coords: Coordinate; creature: Creature | false}>>;
type WeightedCreatureContract = Assert<Equal<WeightedCreature, [type: string, weight: number]>>;
type NeighborCoordinatesContract = Assert<
  Equal<NeighborCoordinates, (x: number, y: number, radius: number) => Coordinate[]>
>;
