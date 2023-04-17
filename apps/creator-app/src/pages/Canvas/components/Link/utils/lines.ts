/* eslint-disable no-param-reassign */
import { NODE_LINK_WIDTH } from '@/pages/Canvas/components/Port/constants';
import { PathPoint, PathPoints, Point } from '@/types';

import { DOUBLE_STRAIGHT_PATH_OFFSET, HALF_BLOCK_WIDTH, STRAIGHT_PATH_OFFSET, TOP_PORT_OFFSET } from '../constants';
import { createPoint, getPoint, getPointsOffset, getPointX, getPointY, isEqualPoints } from './helpers';
import { getSourceNodeXCenter, getTargetEndTopX, getTargetEndTopY, getTargetEndY, getTargetNodeXCenter } from './pathPoints';
import { LinkedRects } from './types';

export type PathLine = [PathPoint, PathPoint];

export const createLine = (start: PathPoint, end: PathPoint): PathLine => [start, end];

export const isVerticalLine = ([start, end]: PathLine): boolean => getPointX(start) === getPointX(end);
export const isHorizontalLine = (line: PathLine): boolean => !isVerticalLine(line);

export const getLineLength = (line: PathLine): number => {
  const [start, end] = line;

  return Math.abs(isVerticalLine(line) ? end.point[1] - start.point[1] : end.point[0] - start.point[0]);
};

export const isVerticalLineReversed = ([start, end]: PathLine): boolean => start.point[1] > end.point[1];
export const isHorizontalLineReversed = ([start, end]: PathLine): boolean => start.point[0] > end.point[0];

export const isFirstLine = (points: PathPoints, [start, end]: PathLine): boolean => isEqualPoints(points[0], start) && isEqualPoints(points[1], end);
export const isLastLine = (points: PathPoints, [start, end]: PathLine): boolean =>
  isEqualPoints(points[points.length - 2], start) && isEqualPoints(points[points.length - 1], end);

export const getActiveLine = (points: PathPoints, [pointX, pointY]: Point): PathLine | null => {
  const lines: PathLine[] = [];

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const nextPoint = points[i + 1];

    if (!nextPoint) {
      break;
    }

    const line = createLine(point, nextPoint);
    const [x, y] = getPoint(point);
    const [nextX, nextY] = getPoint(nextPoint);

    let matched = false;

    if (isVerticalLine(line)) {
      matched = Math.abs(x - pointX) <= 12 && (isVerticalLineReversed(line) ? y >= pointY && nextY <= pointY : y <= pointY && nextY >= pointY);
    } else {
      matched = Math.abs(y - pointY) <= 12 && (isHorizontalLineReversed(line) ? x >= pointX && nextX <= pointX : x <= pointX && nextX >= pointX);
    }

    if (!matched) {
      continue;
    }

    lines.push([point, nextPoint]);
  }

  let activeLine = lines[0];

  if (!activeLine) {
    return null;
  }

  if (isFirstLine(points, activeLine)) {
    activeLine = lines[1] ?? activeLine;
  }

  if (isLastLine(points, activeLine)) {
    activeLine = lines[lines.length - 1] ?? activeLine;
  }

  return activeLine;
};

interface TransformEdgeLineOptions {
  locked: boolean;
  activeLine: PathLine;
  sourceNodeIsChip: boolean;
  sourceNodeIsAction: boolean;
  targetNodeIsCombined: boolean;
}

interface TransformActiveLineOptions {
  activeLine: PathLine;
  mouseCoords: Point;
  sourceNodeIsChip: boolean;
  sourceNodeIsAction: boolean;
  targetNodeIsCombined: boolean;
}

export const transformActiveLine = (points: PathPoints, linkedRects: LinkedRects, options: TransformActiveLineOptions): PathPoints =>
  isVerticalLine(options.activeLine)
    ? transformActiveVerticalLine(points, linkedRects, options)
    : transformActiveHorizontalLine(points, linkedRects, options);

const transformVerticalHeadLine = (
  points: PathPoints,
  linkedRects: LinkedRects,
  { activeLine, sourceNodeIsAction, sourceNodeIsChip }: TransformEdgeLineOptions
): PathPoints => {
  const point = points[0];
  const linkOffset = sourceNodeIsChip ? 0 : NODE_LINK_WIDTH;

  if (point.reversed && getSourceNodeXCenter(linkedRects) < getPointX(activeLine[0])) {
    const offset = sourceNodeIsAction ? linkedRects.sourceNodeRect.left - linkedRects.sourcePortRect.left : linkOffset;

    point.reversed = false;
    point.point[0] = linkedRects.sourceNodeRect.right + offset;
  } else if (!point.reversed && getSourceNodeXCenter(linkedRects) > getPointX(activeLine[0])) {
    const offset = sourceNodeIsAction ? linkedRects.sourcePortRect.right - linkedRects.sourceNodeRect.right : linkOffset;

    point.reversed = true;
    point.point[0] = linkedRects.sourceNodeRect.left - offset;
  }

  return points;
};

const isToTopByY = (startY: number, endY: number): boolean => endY >= startY + DOUBLE_STRAIGHT_PATH_OFFSET + TOP_PORT_OFFSET;

const transformVerticalTailLine = (
  points: PathPoints,
  linkedRects: LinkedRects,
  { locked, activeLine, targetNodeIsCombined }: TransformEdgeLineOptions
): PathPoints => {
  let nextPoints = points;

  const point = points[points.length - 1];
  const targetXOffset = targetNodeIsCombined ? 0 : NODE_LINK_WIDTH;
  const targetStartX = linkedRects.targetNodeRect.left - targetXOffset;
  const targetEndX = linkedRects.targetNodeRect.right + targetXOffset;
  const toTopStartX = targetStartX - STRAIGHT_PATH_OFFSET;
  const toTopEndX = targetEndX + STRAIGHT_PATH_OFFSET;

  if (
    point.allowedToTop &&
    !point.toTop &&
    isToTopByY(getPointY(activeLine[0]), getPointY(point)) &&
    getPointX(activeLine[1]) >= toTopStartX &&
    getPointX(activeLine[1]) <= toTopEndX
  ) {
    activeLine[1].point[1] = getTargetEndTopY(linkedRects) - STRAIGHT_PATH_OFFSET;

    point.point[0] = getTargetEndTopX(linkedRects);
    point.point[1] = getTargetEndTopY(linkedRects) - STRAIGHT_PATH_OFFSET;

    nextPoints = [
      ...nextPoints,
      createPoint(getPointX(point), getPointY(point) + STRAIGHT_PATH_OFFSET, {
        toTop: true,
        reversed: false,
        allowedToTop: true,
      }),
    ];

    point.locked = locked;
    point.reversed = false;
    point.allowedToTop = false;
  } else if (!point.toTop && point.reversed && getTargetNodeXCenter(linkedRects) > getPointX(activeLine[1])) {
    point.reversed = false;
    point.point[0] = linkedRects.targetNodeRect.left - targetXOffset;
  } else if (!point.toTop && !point.reversed && getTargetNodeXCenter(linkedRects) < getPointX(activeLine[0])) {
    point.reversed = true;
    point.point[0] = linkedRects.targetNodeRect.right + targetXOffset;
  }

  return nextPoints;
};

export const transformVerticalHeadAndTailLine = (points: PathPoints, linkedRects: LinkedRects, options: TransformEdgeLineOptions): PathPoints => {
  let nextPoints = points;

  // the line is the second line from the start - first vertical line
  if (points[1] === options.activeLine[0]) {
    nextPoints = transformVerticalHeadLine(points, linkedRects, options);
  }

  // the line is the second line from the end - last vertical line
  if (points[points.length - 2] === options.activeLine[1]) {
    nextPoints = transformVerticalTailLine(points, linkedRects, options);
  }

  return nextPoints;
};

const transformActiveVerticalLine = (
  points: PathPoints,
  linkedRects: LinkedRects,
  { activeLine, mouseCoords: [pointX], sourceNodeIsChip, sourceNodeIsAction, targetNodeIsCombined }: TransformActiveLineOptions
): PathPoints => {
  let nextPoints = points;

  if (isFirstLine(nextPoints, activeLine)) {
    nextPoints = [createPoint(activeLine[0].point, { reversed: activeLine[0].reversed }), ...nextPoints];

    activeLine[0].reversed = false;
  }

  if (isLastLine(nextPoints, activeLine)) {
    const point = activeLine[1];

    if (point.toTop) {
      nextPoints = [
        ...nextPoints,
        createPoint(getPointX(point), getPointY(point) - STRAIGHT_PATH_OFFSET, { locked: true }),
        createPoint(point.point, { toTop: true, allowedToTop: point.allowedToTop }),
      ];

      point.point[1] -= STRAIGHT_PATH_OFFSET;
    } else {
      nextPoints = [...nextPoints, createPoint(point.point, { reversed: point.reversed, allowedToTop: point.allowedToTop })];
    }

    point.toTop = false;
    point.reversed = false;
    point.allowedToTop = false;
  }

  activeLine[0].locked = true;
  activeLine[1].locked = true;
  activeLine[0].point[0] = pointX;
  activeLine[1].point[0] = pointX;

  nextPoints = transformVerticalHeadAndTailLine(nextPoints, linkedRects, {
    locked: true,
    activeLine,
    sourceNodeIsChip,
    sourceNodeIsAction,
    targetNodeIsCombined,
  });

  return nextPoints;
};

export const transformHorizontalHeadAndTailLine = (
  points: PathPoints,
  linkedRects: LinkedRects,
  { locked, activeLine, targetNodeIsCombined }: TransformEdgeLineOptions
): PathPoints => {
  let nextPoints = points;

  if (points[points.length - 2] !== activeLine[1]) return nextPoints;

  const point = points[points.length - 1];

  const xOffset = getPointsOffset(getPointX(activeLine[0]), getPointX(point));
  const yOffset = getPointsOffset(getPointY(activeLine[0]), getPointY(point));

  if (!point.allowedToTop || !point.toTop || yOffset >= 5) return nextPoints;

  const reversed = activeLine[0].point[0] > point.point[0];
  const targetXOffset = targetNodeIsCombined ? 0 : NODE_LINK_WIDTH;

  point.point[0] = reversed ? linkedRects.targetNodeRect.right + targetXOffset : linkedRects.targetNodeRect.left - targetXOffset;
  point.point[1] = getTargetEndY(linkedRects, { isConnected: true });

  if (reversed ? xOffset + HALF_BLOCK_WIDTH < -STRAIGHT_PATH_OFFSET : xOffset - HALF_BLOCK_WIDTH > -STRAIGHT_PATH_OFFSET) {
    nextPoints = [...nextPoints, createPoint(point.point, { reversed, allowedToTop: true })];

    point.point[0] += STRAIGHT_PATH_OFFSET * (reversed ? 1 : -1);

    point.toTop = false;
    point.locked = locked;
    point.reversed = false;
    point.allowedToTop = false;
  } else {
    point.toTop = false;
    point.reversed = reversed;
  }

  // eslint-disable-next-line prefer-destructuring
  activeLine[1].point[0] = point.point[0];

  return nextPoints;
};

const transformActiveHorizontalLine = (
  points: PathPoints,
  linkedRects: LinkedRects,
  { activeLine, mouseCoords: [, pointY], sourceNodeIsChip, sourceNodeIsAction, targetNodeIsCombined }: TransformActiveLineOptions
): PathPoints => {
  let nextPoints = points;

  if (isFirstLine(nextPoints, activeLine)) {
    const point = activeLine[0];
    const offset = STRAIGHT_PATH_OFFSET * (point.reversed ? -1 : 1);

    nextPoints = [
      createPoint(point.point, { reversed: point.reversed }),
      createPoint(getPointX(point) + offset, getPointY(point), { locked: true }),
      ...nextPoints,
    ];

    point.reversed = false;
    point.point[0] += offset;
  }

  if (isLastLine(nextPoints, activeLine)) {
    const point = activeLine[1];
    const offset = STRAIGHT_PATH_OFFSET * (point.reversed ? -1 : 1);

    nextPoints = [
      ...nextPoints,
      createPoint(getPointX(point) - offset, getPointY(point), { locked: true }),
      createPoint(point.point, { toTop: point.toTop, reversed: point.reversed, allowedToTop: point.allowedToTop }),
    ];

    point.toTop = false;
    point.reversed = false;
    point.allowedToTop = false;

    point.point[0] -= offset;
  }

  activeLine[0].locked = true;
  activeLine[1].locked = true;
  activeLine[0].point[1] = pointY;
  activeLine[1].point[1] = pointY;

  nextPoints = transformHorizontalHeadAndTailLine(nextPoints, linkedRects, {
    locked: true,
    activeLine,
    sourceNodeIsChip,
    sourceNodeIsAction,
    targetNodeIsCombined,
  });

  return nextPoints;
};
