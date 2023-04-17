import { Point } from '@/types';

// good old pythagoras
export const getHypotenuse = (lhs: Point, rhs: Point) => {
  const offsetX = Math.abs(lhs[0] - rhs[0]);
  const offsetY = Math.abs(lhs[1] - rhs[1]);

  return Math.sqrt(offsetX ** 2 + offsetY ** 2);
};

export const applyMinMaxCap = (min: number, max: number, valueToCap: number) => {
  return Math.min(Math.max(valueToCap, min), max);
};

// pivot a point around a center by rad degrees: https://stackoverflow.com/a/15109215
export const pivotPoint = (point: Point, pivot: Point, rad: number): Point => {
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);

  return [cos * (point[0] - pivot[0]) - sin * (point[1] - pivot[1]) + pivot[0], sin * (point[0] - pivot[0]) + cos * (point[1] - pivot[1]) + pivot[1]];
};

// if distance from point to center is scaled by scale, calculate new scaled point
export const scalePoint = (point: Point, center: Point, scale: number): Point => {
  const distanceToCenter = getHypotenuse(point, center);
  const scaledDistance = distanceToCenter * scale;

  const originAngleToCenter = Math.atan2(point[1] - center[1], point[0] - center[0]);
  const newPointX = center[0] + Math.cos(originAngleToCenter) * scaledDistance;
  const newPointY = center[1] + Math.sin(originAngleToCenter) * scaledDistance;

  return [newPointX, newPointY];
};
