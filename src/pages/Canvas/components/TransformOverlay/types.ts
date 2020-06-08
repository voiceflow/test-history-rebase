import { Pair, Point } from '@/types';

export type AxialTransformation = {
  scale: Pair<number>;
  offset: Pair<number>;
  size: Pair<number>;
  position: Point;
};
