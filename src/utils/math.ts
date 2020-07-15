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

// eslint-disable-next-line import/prefer-default-export
export const getRotation = (offsetX: number, offsetY: number) => {
  const angle = Math.atan(offsetX / offsetY);

  const radians = offsetY > 0 ? angle : Math.PI + angle;

  // eslint-disable-next-line no-restricted-globals
  return isNaN(radians) ? 0 : radians;
};
