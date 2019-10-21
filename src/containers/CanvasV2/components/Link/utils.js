import { PATH_CURVE_MIN_OFFSET, PATH_INFLECTION_OFFSET } from './constants';

// eslint-disable-next-line import/prefer-default-export
export const buildPath = ([[startX, startY], [endX, endY]]) => {
  const inflectionOffset = Math.abs(endY - startY) > PATH_CURVE_MIN_OFFSET ? PATH_INFLECTION_OFFSET : 0;

  return `M ${startX} ${startY} C ${startX + inflectionOffset} ${startY}, ${endX - inflectionOffset} ${endY}, ${endX} ${endY}`;
};

export const extractPoints = (canvas, start, end) => {
  const startY = start.top + start.height / 2;
  const endY = end.top + start.height / 2;

  return [canvas.transformPoint([start.right, startY]), canvas.transformPoint([end.left, endY])];
};

export const buildCenter = ([[startX, startY], [endX, endY]]) => [startX + (endX - startX) / 2, startY + (endY - startY) / 2];
