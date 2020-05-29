import { LINK_WIDTH } from '@/pages/Canvas/components/Port/constants';
import { Pair, Point } from '@/types';

import { PATH_CURVE_MIN_OFFSET, PATH_INFLECTION_OFFSET } from './constants';

export const getVirtualPoints = (points: Pair<Point> | null): Pair<Point> | null => {
  if (!points) return null;

  const [[x1, y1], [x2, y2]] = points;

  return [
    [x1 + LINK_WIDTH, y1],
    [x2, y2],
  ];
};

export const buildHeadMarker = (id: string) => `url(#head-${id})`;

export const buildPath = (points: Pair<Point> | null) => {
  if (!points) return null;

  const [[startX, startY], [endX, endY]] = points;

  const inflectionOffset = Math.abs(endY - startY) > PATH_CURVE_MIN_OFFSET ? PATH_INFLECTION_OFFSET : 0;

  return `M ${startX} ${startY} C ${startX + inflectionOffset} ${startY}, ${endX - inflectionOffset} ${endY}, ${endX} ${endY}`;
};

export const buildCenter = (points: Pair<Point> | null): Point | null => {
  if (!points) return null;

  const [[startX, startY], [endX, endY]] = points;

  return [startX + (endX - startX) / 2, startY + (endY - startY) / 2];
};
