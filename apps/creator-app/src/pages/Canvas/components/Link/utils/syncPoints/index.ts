/* eslint-disable no-param-reassign */
import { Pair, PathPoint, PathPoints, Point } from '@/types';

import { clonePoint, getPointX, getPointY } from '../helpers';
import { createLine, isVerticalLine, transformVerticalHeadAndTailLine } from '../lines';
import {
  getPathPoints,
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

interface SyncStraightSourceTargetOptions {
  points: PathPoints;
  movement: Point;
  linkedRects: LinkedRects;
  sourceNodeIsChip: boolean;
  sourceNodeIsAction: boolean;
  targetNodeIsCombined: boolean;
}

interface SyncSourcePointsOptions {
  points: PathPoints;
  options: SyncPointsOptions;
  linkedRects: LinkedRects;
}

interface SyncTargetPointsOptions extends SyncSourcePointsOptions {
  shouldClone: boolean;
}

const clonePoints = (points: PathPoints): PathPoints => points.map((point) => clonePoint(point));

const syncStraightSourceAndTargetPoints = (points: PathPoints, [moveX, moveY]: Pair<number>): PathPoints => {
  for (let i = 0; i < points.length; i++) {
    points[i].point[0] += moveX;
    points[i].point[1] += moveY;
  }

  return points;
};

const syncStraightSourcePoints = ({
  points,
  movement: [moveX, moveY],
  linkedRects,
  sourceNodeIsChip,
  sourceNodeIsAction,
  targetNodeIsCombined,
}: SyncStraightSourceTargetOptions): PathPoints => {
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

  return transformVerticalHeadAndTailLine(points, linkedRects, {
    locked: false,
    activeLine: createLine(points[1], points[2]),
    sourceNodeIsChip,
    sourceNodeIsAction,
    targetNodeIsCombined,
  });
};

const syncSourcePoints = ({ points, options, linkedRects }: SyncSourcePointsOptions): PathPoints => {
  const startPoint = points[0];

  if (!startPoint || !options.isStraight || !options.isPathLocked) return getPathPoints(linkedRects, options);

  const newStartX = startPoint.reversed ? getSourceStartLeftX(linkedRects, options) : getSourceStartRightX(linkedRects, options);
  const newStartY = startPoint.reversed ? getSourceStartLeftY(linkedRects) : getSourceStartRightY(linkedRects);
  const currentStartX = getPointX(startPoint);
  const currentStartY = getPointY(startPoint);

  // skip sync if start point is not changed
  if (currentStartX === newStartX && currentStartY === newStartY) return points;

  const movement: Point = [newStartX - currentStartX, newStartY - currentStartY];

  if (options.sourceAndTargetSelected) return syncStraightSourceAndTargetPoints(clonePoints(points), movement);

  return syncStraightSourcePoints({
    points: clonePoints(points),
    movement,
    linkedRects,
    sourceNodeIsChip: options.sourceNodeIsChip,
    sourceNodeIsAction: options.sourceNodeIsAction,
    targetNodeIsCombined: options.targetNodeIsCombined,
  });
};

const syncStraightTargetPoints = ({
  points,
  movement: [moveX, moveY],
  linkedRects,
  sourceNodeIsChip,
  sourceNodeIsAction,
  targetNodeIsCombined,
}: SyncStraightSourceTargetOptions): PathPoints => {
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

  return transformVerticalHeadAndTailLine(points, linkedRects, {
    locked: false,
    activeLine: createLine(points[points.length - 3], points[points.length - 2]),
    sourceNodeIsChip,
    sourceNodeIsAction,
    targetNodeIsCombined,
  });
};

const syncTargetPoints = ({ points, options, shouldClone, linkedRects }: SyncTargetPointsOptions): PathPoints => {
  const endPoint = points[points.length - 1];

  if (!endPoint) return getPathPoints(linkedRects, options);

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

  if (!options.isStraight || !options.isPathLocked) return getPathPoints(linkedRects, options);

  const movement: Point = [newEndX - currentEndX, newEndY - currentEndY];

  return syncStraightTargetPoints({
    points: shouldClone ? clonePoints(points) : points,
    movement,
    linkedRects,
    sourceNodeIsChip: options.sourceNodeIsChip,
    sourceNodeIsAction: options.sourceNodeIsAction,
    targetNodeIsCombined: options.targetNodeIsCombined,
  });
};

export const syncPointsWithLinkedRects = (points: PathPoints, linkedRects: LinkedRects, options: SyncPointsOptions): PathPoints => {
  let newPoints = points;

  if (!options.syncOnlyTarget) {
    newPoints = syncSourcePoints({ points: newPoints, options, linkedRects });
  }

  if (!options.syncOnlySource) {
    newPoints = syncTargetPoints({ points: newPoints, options, shouldClone: points === newPoints, linkedRects });
  }

  return newPoints;
};
