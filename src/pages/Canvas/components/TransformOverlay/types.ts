import { Pair, Point } from '@/types';

export type AxialTransformation = {
  scale: Pair<number>;
  shift: Pair<number>;
  size: Pair<number>;
  position: Point;
};
