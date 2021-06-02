import { Point } from '@/types';

export type MovementCalculator = (mouseLocation: Point) => [number, number, number];

export type TransitionOptions = {
  delay?: number;
  duration?: number;
};

export type TransformOptions = {
  relative?: boolean;
  bounding?: boolean;
};

export type ZoomOptions = {
  origin?: Point;
};

export type StyleOptions = {
  zoom?: number;
  position?: Point;
};
