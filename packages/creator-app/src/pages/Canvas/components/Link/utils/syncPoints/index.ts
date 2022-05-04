/* eslint-disable no-param-reassign */
import { Pair, PathPoint, PathPoints, Point } from '@/types';

import { clonePoint, getPointX, getPointY } from '../helpers';
import { createLine, isVerticalLine, transformVerticalHeadAndTailsLine } from '../lines';
import {
  getPathPointsV2,
  getSourceStartLeftX,
  getSourceStartLeftY,
  getSourceStartRightX,
  getSourceStartRightY,
  getTargetEndLeftX,
  getTargetEndLeftY,
  getTargetEndRightX,
  getTargetEndRightY,
  getTargetEndTopX,
  getTargetEndTopY,
} from '../pathPoints';
import { LinkedRects } from '../types';
import { SyncPointsOptions } from './types';

const syncStraightSourceAndTargetPoints = (points: PathPoints, [moveX, moveY]: Pair<number>): PathPoints => {
  for (let i = 0; i < points.length; i++) {
    points[i].point[0] += moveX;
    points[i].point[1] += moveY;
  }

  return points;
};

const syncStraightSourcePoints = (points: PathPoints, [moveX, moveY]: Point): PathPoints => {
  let nextPoints = points;
  let prevPoint: PathPoint | null = null;

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const isVertical = !!prevPoint && isVerticalLine(createLine(prevPoint, point));

    prevPoint = clonePoint(point);

    if (point.locked) {
      if (isVertical) {
        point.point[0] += moveX;
      } else if (prevPoint) {
        point.point[1] += moveY;
      }

      break;
    }

    point.point[0] += moveX;
    point.point[1] += moveY;
  }

  nextPoints = transformVerticalHeadAndTailsLine(nextPoints, createLine(nextPoints[1], nextPoints[2]), { locked: false });

  return nextPoints;
};

const clonePoints = (points: PathPoints): PathPoints => points.map((point) => clonePoint(point));

const syncSourcePoints = (points: PathPoints, linkedRects: LinkedRects, options: SyncPointsOptions): PathPoints => {
  const startPoint = points[0];

  if (!startPoint || !options.isStraight || !options.isPathLocked) return getPathPointsV2(linkedRects, options);

  const newStartX = startPoint.reversed ? getSourceStartLeftX(linkedRects, options) : getSourceStartRightX(linkedRects, options);
  const newStartY = startPoint.reversed ? getSourceStartLeftY(linkedRects) : getSourceStartRightY(linkedRects);
  const currentStartX = getPointX(startPoint);
  const currentStartY = getPointY(startPoint);

  // skip sync if start point is not changed
  if (currentStartX === newStartX && currentStartY === newStartY) return points;

  const movement: Point = [newStartX - currentStartX, newStartY - currentStartY];

  if (options.sourceAndTargetSelected) return syncStraightSourceAndTargetPoints(clonePoints(points), movement);

  return syncStraightSourcePoints(clonePoints(points), movement);
};

const syncStraightTargetPoints = (points: PathPoints, [moveX, moveY]: Point): PathPoints => {
  let nextPoints = points;
  let nextPoint: PathPoint | null = null;

  for (let i = points.length - 1; i >= 0; i--) {
    const point = points[i];
    const isVertical = !!nextPoint && isVerticalLine(createLine(point, nextPoint));

    nextPoint = clonePoint(point);

    if (point.locked) {
      if (isVertical) {
        point.point[0] += moveX;
      } else if (nextPoint) {
        point.point[1] += moveY;
      }

      break;
    }

    point.point[0] += moveX;
    point.point[1] += moveY;
  }

  nextPoints = transformVerticalHeadAndTailsLine(nextPoints, createLine(nextPoints[nextPoints.length - 3], nextPoints[nextPoints.length - 2]), {
    locked: false,
  });

  return nextPoints;
};

const syncTargetPoints = (points: PathPoints, linkedRects: LinkedRects, options: SyncPointsOptions, shouldClone: boolean): PathPoints => {
  const endPoint = points[points.length - 1];

  if (!endPoint) return getPathPointsV2(linkedRects, options);

  // eslint-disable-next-line no-nested-ternary
  const newEndX = endPoint.toTop
    ? getTargetEndTopX(linkedRects)
    : endPoint.reversed
    ? getTargetEndRightX(linkedRects, options)
    : getTargetEndLeftX(linkedRects, options);
  // eslint-disable-next-line no-nested-ternary
  const newEndY = endPoint.toTop
    ? getTargetEndTopY(linkedRects)
    : endPoint.reversed
    ? getTargetEndRightY(linkedRects, options)
    : getTargetEndLeftY(linkedRects, options);
  const currentEndX = getPointX(endPoint);
  const currentEndY = getPointY(endPoint);

  // skip sync if start point is not changed
  if (currentEndX === newEndX && currentEndY === newEndY) return points;

  if (!options.isStraight || !options.isPathLocked) return getPathPointsV2(linkedRects, options);

  const movement: Point = [newEndX - currentEndX, newEndY - currentEndY];

  return syncStraightTargetPoints(shouldClone ? clonePoints(points) : points, movement);
};

export const syncPointsWithLinkedRects = (points: PathPoints, linkedRects: LinkedRects, options: SyncPointsOptions): PathPoints => {
  let newPoints = points;

  if (!options.syncOnlyTarget) {
    newPoints = syncSourcePoints(newPoints, linkedRects, options);
  }

  if (!options.syncOnlySource) {
    newPoints = syncTargetPoints(newPoints, linkedRects, options, points === newPoints);
  }

  return newPoints;
};
