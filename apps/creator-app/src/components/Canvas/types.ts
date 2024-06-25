import type { Point } from '@/types';

export type MovementCalculator = (mouseLocation: Point) => [number, number, number];

export interface TransitionOptions {
  delay?: number;
  duration?: number;
}

export interface TransformOptions {
  relative?: boolean;
  bounding?: boolean;
}

export interface ZoomOptions {
  raf?: boolean;
  origin?: Point;
  clearGrid?: boolean;
}

export interface StyleOptions {
  raf?: boolean;
  zoom?: number;
  position?: Point;
  onApplied?: VoidFunction;
}
