import { Nullable } from '@voiceflow/common';

import { PathPoints } from '@/types';
import { pathBuilder } from '@/utils/svg';

import { MIN_Y_POINTS_OFFSET, PATH_INFLECTION_OFFSET, STRAIGHT_PATH_RADIUS } from '../constants';
import { getPoint, getPointsOffset, getPointX, getPointY, isEqualPoints } from './helpers';
import { createLine, isHorizontalLineReversed, isVerticalLine, isVerticalLineReversed } from './lines';

const getRadius = (offset: number): number => Math.max(Math.min(Math.abs(offset) / 2, STRAIGHT_PATH_RADIUS), 0);
const isStraightLine = (start: number, end: number): boolean => Math.abs(end - start) <= MIN_Y_POINTS_OFFSET;

export const buildPath = (points: Nullable<PathPoints>, { isStraight }: { isStraight: boolean }): string => {
  if (!points) {
    return '';
  }

  return isStraight ? buildStraightPath(points) : buildCurvePath(points);
};

const buildCurvePath = (points: PathPoints): string => {
  const [startX, startY] = getPoint(points[0]);
  const [endX, endY] = getPoint(points[1]);

  const inflectionOffset = isStraightLine(startY, endY) ? 0 : PATH_INFLECTION_OFFSET;

  return `M ${startX} ${startY} C ${startX + inflectionOffset} ${startY}, ${endX - inflectionOffset} ${endY}, ${endX} ${endY}`;
};

const buildStraightPath = (points: PathPoints): string => {
  const [startX, startY] = getPoint(points[0]);

  const builder = pathBuilder(startX, startY);

  if (points.length === 2 && isStraightLine(startY, getPointY(points[1]))) {
    return builder.lineTo(getPointX(points[1]), getPointY(points[1])).toString();
  }

  for (let i = 1; i < points.length; i++) {
    const point = points[i];

    const [x, y] = getPoint(point);
    const prevPoint = points[i - 1];
    const nextPoint = points[i + 1] ?? null;

    if (!nextPoint) {
      builder.lineTo(x, y);

      break;
    }

    const [prevX, prevY] = getPoint(prevPoint);
    const [nextX, nextY] = getPoint(nextPoint);

    const prevOffsetX = getPointsOffset(prevX, x);
    const prevOffsetY = getPointsOffset(prevY, y);
    const nextOffsetX = getPointsOffset(x, nextX);
    const nextOffsetY = getPointsOffset(y, nextY);

    const prevRadiusX = getRadius(prevOffsetX);
    const prevRadiusY = getRadius(prevOffsetY);
    const nextRadiusX = getRadius(nextOffsetX);
    const nextRadiusY = getRadius(nextOffsetY);

    const prevLine = createLine(prevPoint, point);
    const nextLine = createLine(point, nextPoint);

    if (isEqualPoints(prevPoint, point)) {
      continue;
    }

    const isPrevVertical = isVerticalLine(prevLine);
    const isNextVertical = isVerticalLine(nextLine);
    const isPrevReversed = isPrevVertical ? isVerticalLineReversed(prevLine) : isHorizontalLineReversed(prevLine);
    const isNextReversed = isNextVertical ? isVerticalLineReversed(nextLine) : isHorizontalLineReversed(nextLine);

    const nextRadius = isNextVertical ? nextRadiusY : nextRadiusX;
    const prevRadius = isPrevVertical ? prevRadiusY : prevRadiusX;

    const radius = Math.min(nextRadius, prevRadius);
    const halfRadius = radius / 2;

    if (!radius || (!isPrevVertical && !isNextVertical)) {
      builder.lineTo(x, y);
      continue;
    }

    if (isPrevVertical) {
      builder.lineTo(x, y + radius * (isPrevReversed ? 1 : -1));
    } else {
      builder.lineTo(x + radius * (isPrevReversed ? 1 : -1), y);
    }

    if (isNextVertical) {
      builder.cubicCurveTo(
        [x + (isPrevReversed ? halfRadius : -halfRadius), y],
        [x, y + (isNextReversed ? -halfRadius : halfRadius)],
        [x, y + (isNextReversed ? -radius : radius)]
      );
    } else {
      builder.cubicCurveTo(
        [x, y + (isPrevReversed ? halfRadius : -halfRadius)],
        [x + (isNextReversed ? -halfRadius : halfRadius), y],
        [x + (isNextReversed ? -radius : radius), y]
      );
    }
  }

  return builder.toString();
};
