import { Pair, Point } from '@/types';

export const getHypotenuse = (lhs: Point, rhs: Point) => {
  const offsetX = Math.abs(lhs[0] - rhs[0]);
  const offsetY = Math.abs(lhs[1] - rhs[1]);

  return Math.sqrt(offsetX ** 2 + offsetY ** 2);
};

export const applyRotation = (length: number, rotation: number): Pair<number> => {
  const offsetX = Math.sin(rotation) / length;
  const offsetY = Math.cos(rotation) / length;

  return [offsetX, offsetY];
};

export const getRotation = (offsetX: number, offsetY: number) => {
  // x / y instead of y / x because our initial arm is the positive y-axis not
  // positive x-axis and we need to rotate clockwise not counter-clockwise.
  let angle = Math.atan(offsetX / offsetY);

  // If we're in the 2nd or 3rd quadrant, then make the necessary adjustments.
  angle = offsetY > 0 ? angle : Math.PI + angle;

  // If we're in the 4th quadrant, then make the angle positive.
  angle = angle < 0 ? 2 * Math.PI + angle : angle;

  // eslint-disable-next-line no-restricted-globals
  return isNaN(angle) ? 0 : angle;
};

export const applyMinMaxCap = (min: number, max: number, valueToCap: number) => {
  return Math.min(Math.max(valueToCap, min), max);
};
