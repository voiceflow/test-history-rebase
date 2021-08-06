import { Pair, Point } from '@/types';

export interface AxialTransformation {
  scale: Pair<number>;
  shift: Pair<number>;
  size: Pair<number>;
  position: Point;
}
