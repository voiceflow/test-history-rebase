import { BLOCK_WIDTH } from '@/styles/theme';
import { Pair, PathPoint, PathPoints, Point } from '@/types';

import { HALF_BLOCK_WIDTH, TOP_PORT_OFFSET } from '../constants';
import { getCurvePathPoints, getStraightConnectedPathPoints } from './getPathPoints';
import { clonePoint, getPointX, getPointY } from './helpers';
import {
  createLine,
  getLineLength,
  isHorizontalLineReversed,
  isVerticalLine,
  isVerticalLineReversed,
  transformVerticalHeadAndTailsLine,
} from './lines';

export * from './getPathPoints';
export * from './helpers';

export const updateSourceSourceTargetPoints = (
  sourceTargetPoints: Pair<Point>,
  moves: Pair<number>,
  { straight = false, sourceAndTargetSelected = false }: { straight?: boolean; sourceAndTargetSelected?: boolean } = {}
): Pair<Point> =>
  !straight
    ? updateCurveSourceSourceTargetPoints(sourceTargetPoints, moves)
    : updateStraightSourceSourceTargetPoints(sourceTargetPoints, moves, { sourceAndTargetSelected });

export const updateTargetSourceTargetPoints = (
  sourceTargetPoints: Pair<Point>,
  moves: Pair<number>,
  { straight = false, sourceAndTargetSelected = false }: { straight?: boolean; sourceAndTargetSelected?: boolean } = {}
): Pair<Point> =>
  !straight
    ? updateCurveTargetSourceTargetPoints(sourceTargetPoints, moves)
    : updateStraightTargetSourceTargetPoints(sourceTargetPoints, moves, { sourceAndTargetSelected });

export const syncPointsWithSourceAndTarget = (
  points: PathPoints,
  sourceTargetPoints: Pair<Point> | null,
  data: {
    straight?: boolean;
    isPathLocked?: boolean;
    targetIsBlock?: boolean;
    syncOnlySource?: boolean;
    syncOnlyTarget?: boolean;
    sourceBlockEndY?: number | null;
    sourceAndTargetSelected?: boolean;
  }
): PathPoints => {
  let newPoints = points.map((point) => clonePoint(point));

  if (!sourceTargetPoints) {
    return newPoints;
  }

  const [start, end] = sourceTargetPoints;
  const first = newPoints[0];
  const last = newPoints[newPoints.length - 1];
  const firstPointOffsetX = first.reversed ? BLOCK_WIDTH : 0;
  // eslint-disable-next-line no-nested-ternary
  const lastPointOffsetX = last.toTop ? HALF_BLOCK_WIDTH : last.reversed ? BLOCK_WIDTH : 0;
  const lastPointOffsetY = last.toTop ? TOP_PORT_OFFSET : 0;

  if (!data.syncOnlyTarget && (getPointY(first) !== start[1] || getPointX(first) !== start[0] - firstPointOffsetX)) {
    newPoints = updateSourcePathPoints(newPoints, [start[0] - firstPointOffsetX - getPointX(first), start[1] - getPointY(first)], {
      ...data,
      sourceTargetPoints,
    });
  }

  if (!data.syncOnlySource && (getPointX(last) !== end[0] + lastPointOffsetX || getPointY(last) !== end[1] - lastPointOffsetY)) {
    newPoints = updateTargetPathPoints(newPoints, [end[0] + lastPointOffsetX - getPointX(last), end[1] - lastPointOffsetY - getPointY(last)], {
      ...data,
      sourceTargetPoints,
    });
  }

  return newPoints;
};

const updateSourcePathPoints = (
  points: PathPoints,
  moves: Pair<number>,
  {
    straight = false,
    isPathLocked = false,
    targetIsBlock = false,
    sourceBlockEndY = null,
    sourceTargetPoints,
    sourceAndTargetSelected = false,
  }: {
    straight?: boolean;
    isPathLocked?: boolean;
    targetIsBlock?: boolean;
    sourceBlockEndY?: number | null;
    sourceTargetPoints: Pair<Point>;
    sourceAndTargetSelected?: boolean;
  }
): PathPoints =>
  !straight
    ? getCurvePathPoints(sourceTargetPoints)
    : updateStraightSourcePathPoints(points, moves, { targetIsBlock, isPathLocked, sourceBlockEndY, sourceTargetPoints, sourceAndTargetSelected });

const updateTargetPathPoints = (
  points: PathPoints,
  moves: Pair<number>,
  {
    straight = false,
    isPathLocked = false,
    targetIsBlock = false,
    sourceBlockEndY = null,
    sourceTargetPoints,
    sourceAndTargetSelected = false,
  }: {
    straight?: boolean;
    isPathLocked?: boolean;
    targetIsBlock?: boolean;
    sourceBlockEndY?: number | null;
    sourceTargetPoints: Pair<Point>;
    sourceAndTargetSelected?: boolean;
  }
): PathPoints =>
  !straight
    ? getCurvePathPoints(sourceTargetPoints)
    : updateStraightTargetPathPoints(points, moves, { targetIsBlock, isPathLocked, sourceBlockEndY, sourceTargetPoints, sourceAndTargetSelected });

export const getPathPointsCenter = (points: PathPoints, { straight }: { straight: boolean }): Point =>
  straight ? getStraightPathPointsCenter(points) : getCurvePathPointsCenter(points);

const getCurvePathPointsCenter = (points: PathPoints): Point => {
  const [startX, startY] = points[0].point;
  const [endX, endY] = points[points.length - 1].point;

  return [startX + (endX - startX) / 2, startY + (endY - startY) / 2];
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

const updateStraightAllPathPoints = (points: PathPoints, [moveX, moveY]: Pair<number>): PathPoints => {
  for (let i = 0; i < points.length; i++) {
    points[i].point[0] += moveX;
    points[i].point[1] += moveY;
  }

  return points;
};

const updateCurveSourceSourceTargetPoints = ([start, end]: Pair<Point>, [moveX, moveY]: Pair<number>): Pair<Point> => [
  [start[0] + moveX, start[1] + moveY],
  end,
];

const updateCurveTargetSourceTargetPoints = ([start, end]: Pair<Point>, [moveX, moveY]: Pair<number>): Pair<Point> => [
  start,
  [end[0] + moveX, end[1] + moveY],
];

const updateStraightSourceSourceTargetPoints = (
  [start, end]: Pair<Point>,
  [moveX, moveY]: Pair<number>,
  { sourceAndTargetSelected }: { sourceAndTargetSelected: boolean }
): Pair<Point> => [[start[0] + moveX, start[1] + moveY], sourceAndTargetSelected ? [end[0] + moveX, end[1] + moveY] : end];

const updateStraightTargetSourceTargetPoints = (
  [start, end]: Pair<Point>,
  [moveX, moveY]: Pair<number>,
  { sourceAndTargetSelected }: { sourceAndTargetSelected: boolean }
): Pair<Point> => [sourceAndTargetSelected ? [start[0] + moveX, start[1] + moveY] : start, [end[0] + moveX, end[1] + moveY]];

const updateStraightSourcePathPoints = (
  points: PathPoints,
  [moveX, moveY]: Pair<number>,
  {
    isPathLocked,
    targetIsBlock,
    sourceBlockEndY,
    sourceTargetPoints,
    sourceAndTargetSelected,
  }: {
    isPathLocked: boolean;
    targetIsBlock: boolean;
    sourceBlockEndY: number | null;
    sourceTargetPoints: Pair<Point>;
    sourceAndTargetSelected: boolean;
  }
): PathPoints => {
  if (!isPathLocked) {
    return getStraightConnectedPathPoints(sourceTargetPoints, { targetIsBlock, sourceBlockEndY });
  }

  if (sourceAndTargetSelected) {
    return updateStraightAllPathPoints(points, [moveX, moveY]);
  }

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

const updateStraightTargetPathPoints = (
  points: PathPoints,
  [moveX, moveY]: Pair<number>,
  {
    isPathLocked,
    targetIsBlock,
    sourceBlockEndY,
    sourceTargetPoints,
    sourceAndTargetSelected,
  }: {
    isPathLocked: boolean;
    targetIsBlock: boolean;
    sourceBlockEndY: number | null;
    sourceTargetPoints: Pair<Point>;
    sourceAndTargetSelected: boolean;
  }
): PathPoints => {
  if (!isPathLocked) {
    return getStraightConnectedPathPoints(sourceTargetPoints, { targetIsBlock, sourceBlockEndY });
  }

  if (sourceAndTargetSelected) {
    return updateStraightAllPathPoints(points, [moveX, moveY]);
  }

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
