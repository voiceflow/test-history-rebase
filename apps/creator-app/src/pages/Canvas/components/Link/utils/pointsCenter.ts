import type { PathPoints, Point } from '@/types';

import { getPointX, getPointY } from './helpers';
import { createLine, getLineLength, isHorizontalLineReversed, isVerticalLine, isVerticalLineReversed } from './lines';

const getStraightPathPointsLength = (points: PathPoints): number => {
  let sum = 0;

  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1];
    const point = points[i];
    const line = createLine(prevPoint, point);

    sum += getLineLength(line);
  }

  return sum;
};

const getStraightPathPointsCenter = (points: PathPoints): Point => {
  const pointsLength = getStraightPathPointsLength(points);
  const pointsLengthCenter = pointsLength / 2;

  let delta = pointsLengthCenter;

  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1];
    const point = points[i];
    const line = createLine(prevPoint, point);
    const length = getLineLength(line);

    if (delta <= length) {
      return isVerticalLine(line)
        ? [getPointX(line[0]), getPointY(line[0]) + (isVerticalLineReversed(line) ? -delta : delta)]
        : [getPointX(line[0]) + (isHorizontalLineReversed(line) ? -delta : delta), getPointY(line[0])];
    }
    delta -= length;
  }

  return [0, 0];
};

const getCurvePathPointsCenter = (points: PathPoints): Point => {
  if (points.length === 0) return [0, 0];

  const [startX, startY] = points[0].point;
  const [endX, endY] = points[points.length - 1].point;

  return [startX + (endX - startX) / 2, startY + (endY - startY) / 2];
};

export const getPathPointsCenter = (points: PathPoints, { isStraight }: { isStraight: boolean }): Point =>
  isStraight ? getStraightPathPointsCenter(points) : getCurvePathPointsCenter(points);
