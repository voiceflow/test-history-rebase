/* eslint-disable no-param-reassign */
import { BLOCK_WIDTH } from '@/styles/theme';
import { PathPoint, PathPoints, Point } from '@/types';

import { HALF_BLOCK_WIDTH, STRAIGHT_PATH_OFFSET, TOP_PORT_OFFSET } from '../constants';
import { createPoint, getPoint, getPointsOffset, getPointX, getPointY, isEqualPoints, isToTopByY } from './helpers';

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

interface TransformActiveLineOptions {
  points: PathPoints;
  activeLine: PathLine;
  mouseCoords: Point;
}

export const transformActiveLine = (options: TransformActiveLineOptions): PathPoints =>
  isVerticalLine(options.activeLine) ? transformActiveVerticalLine(options) : transformActiveHorizontalLine(options);

export const transformVerticalHeadAndTailsLine = (points: PathPoints, activeLine: PathLine, { locked }: { locked: boolean }): PathPoints => {
  let nextPoints = points;

  // the line is the second line from the start
  if (points[1] === activeLine[0]) {
    const point = points[0];

    if (point.reversed && getPointX(point) + HALF_BLOCK_WIDTH < getPointX(activeLine[0])) {
      point.reversed = false;
      point.point[0] += BLOCK_WIDTH;
    } else if (!point.reversed && getPointX(point) - HALF_BLOCK_WIDTH > getPointX(activeLine[0])) {
      point.reversed = true;
      point.point[0] -= BLOCK_WIDTH;
    }
  }

  // the line is the second line from the end
  if (points[points.length - 2] === activeLine[1]) {
    const point = points[points.length - 1];
    const startX = getPointX(point) - (point.reversed ? BLOCK_WIDTH : 0) - STRAIGHT_PATH_OFFSET;
    const endX = getPointX(point) + (point.reversed ? BLOCK_WIDTH : 0) + STRAIGHT_PATH_OFFSET;

    if (
      point.allowedToTop &&
      !point.toTop &&
      isToTopByY(getPointY(activeLine[0]), getPointY(point)) &&
      getPointX(activeLine[1]) >= startX &&
      getPointX(activeLine[1]) <= endX
    ) {
      activeLine[1].point[1] -= STRAIGHT_PATH_OFFSET + TOP_PORT_OFFSET;

      point.point[0] += HALF_BLOCK_WIDTH * (point.reversed ? -1 : 1);
      point.point[1] -= STRAIGHT_PATH_OFFSET + TOP_PORT_OFFSET;

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
    } else if (!point.toTop && point.reversed && getPointX(point) - HALF_BLOCK_WIDTH > getPointX(activeLine[1])) {
      point.reversed = false;
      point.point[0] -= BLOCK_WIDTH;
    } else if (!point.toTop && !point.reversed && getPointX(point) + HALF_BLOCK_WIDTH < getPointX(activeLine[0])) {
      point.reversed = true;
      point.point[0] += BLOCK_WIDTH;
    }
  }

  return nextPoints;
};

const transformActiveVerticalLine = ({ points, activeLine, mouseCoords: [pointX] }: TransformActiveLineOptions): PathPoints => {
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

  nextPoints = transformVerticalHeadAndTailsLine(nextPoints, activeLine, { locked: true });

  return nextPoints;
};

export const transformHorizontalHeadAndTailsLine = (points: PathPoints, activeLine: PathLine, { locked }: { locked: boolean }): PathPoints => {
  let nextPoints = points;

  // the line is the second line from the end
  if (points[points.length - 2] === activeLine[1]) {
    const point = points[points.length - 1];

    const xOffset = getPointsOffset(getPointX(activeLine[0]), getPointX(point));
    const yOffset = getPointsOffset(getPointY(activeLine[0]), getPointY(point));

    if (point.allowedToTop && point.toTop && yOffset < 5) {
      const reversed = activeLine[0].point[0] > point.point[0];

      point.point[0] += HALF_BLOCK_WIDTH * (reversed ? 1 : -1);
      point.point[1] += TOP_PORT_OFFSET;

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
    }
  }

  return nextPoints;
};

const transformActiveHorizontalLine = ({ points, activeLine, mouseCoords: [, pointY] }: TransformActiveLineOptions): PathPoints => {
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

  nextPoints = transformHorizontalHeadAndTailsLine(nextPoints, activeLine, { locked: true });

  return nextPoints;
};
