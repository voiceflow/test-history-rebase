import { Pair, Point } from '@/types';

import { PATH_CURVE_MIN_OFFSET, PATH_INFLECTION_OFFSET } from './constants';

export const buildHeadMarker = (id: string) => `url(#head-${id})`;

export const buildPath = ([[startX, startY], [endX, endY]]: Pair<Point>) => {
  const inflectionOffset = Math.abs(endY - startY) > PATH_CURVE_MIN_OFFSET ? PATH_INFLECTION_OFFSET : 0;

  return `M ${startX} ${startY} C ${startX + inflectionOffset} ${startY}, ${endX - inflectionOffset} ${endY}, ${endX} ${endY}`;
};

export const buildCenter = ([[startX, startY], [endX, endY]]: Pair<Point>): Point => [startX + (endX - startX) / 2, startY + (endY - startY) / 2];
