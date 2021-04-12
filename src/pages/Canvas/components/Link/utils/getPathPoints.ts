import { BLOCK_WIDTH } from '@/styles/theme';
import { Pair, PathPoints, Point } from '@/types';

import {
  DOUBLE_BLOCK_WIDTH,
  DOUBLE_STRAIGHT_PATH_OFFSET,
  HALF_BLOCK_WIDTH,
  PATH_MIN_OFFSET,
  STRAIGHT_PATH_OFFSET,
  TOP_PORT_OFFSET,
} from '../constants';
import { createPoint, getPointsOffset, isToTopByY } from './helpers';

export const isLessThanMinPathOffset = (start: number, end: number): boolean => Math.abs(end - start) <= PATH_MIN_OFFSET;

export const isTargetPortWithoutTopOffsetUnderSourcePortWithDoubleOffset = ([[, startY], [, endY]]: Pair<Point>): boolean => isToTopByY(startY, endY);

export const isTargetPortWithOffsetToRightOfSourcePort = ([[startX], [endX]]: Pair<Point>): boolean => endX >= startX + STRAIGHT_PATH_OFFSET;

export const isTargetPortWithDoubleOffsetToRightOfSourcePort = ([[startX], [endX]]: Pair<Point>): boolean =>
  endX >= startX + DOUBLE_STRAIGHT_PATH_OFFSET;

export const isTargetPortWithOffsetToRightOfSourceBlockCenter = ([[startX], [endX]]: Pair<Point>): boolean =>
  endX - STRAIGHT_PATH_OFFSET >= startX - HALF_BLOCK_WIDTH;

export const isTargetPortToRightOfSourceBlockCenter = ([[startX], [endX]]: Pair<Point>): boolean => endX >= startX - HALF_BLOCK_WIDTH;

export const isTargetBlockCenterToRightOfStartOfSourceBlock = ([[startX], [endX]]: Pair<Point>): boolean =>
  endX + HALF_BLOCK_WIDTH >= startX - BLOCK_WIDTH;

export const isTargetPortWithOffsetToRightOfStartOfSourceBlock = ([[startX], [endX]]: Pair<Point>): boolean =>
  endX + STRAIGHT_PATH_OFFSET >= startX - BLOCK_WIDTH;

export const isTargetBlockCenterWithOffsetToRightOfStartOfSourceBlock = ([[startX], [endX]]: Pair<Point>): boolean =>
  endX + HALF_BLOCK_WIDTH + STRAIGHT_PATH_OFFSET >= startX - BLOCK_WIDTH;

export const isTargetBlockEndWithDoubleOffsetToRightOfStartOfSourceBlock = ([[startX], [endX]]: Pair<Point>): boolean =>
  endX + DOUBLE_STRAIGHT_PATH_OFFSET >= startX - DOUBLE_BLOCK_WIDTH;

export const isTargetBlockCenterToRightOfSourceBlockCenter = ([[startX], [endX]]: Pair<Point>): boolean => endX >= startX - BLOCK_WIDTH;

export const getPathPoints = (
  startEndPoints: Pair<Point> | null,
  {
    straight = false,
    connected = false,
    targetIsBlock = false,
    sourceBlockEndY = null,
  }: { straight?: boolean; connected?: boolean; targetIsBlock?: boolean; sourceBlockEndY?: number | null } = {}
): PathPoints | null => {
  if (!startEndPoints) {
    return null;
  }

  if (!straight) {
    return getCurvePathPoints(startEndPoints);
  }

  return connected
    ? getStraightConnectedPathPoints(startEndPoints, { targetIsBlock, sourceBlockEndY })
    : getStraightUnconnectedPathPoints(startEndPoints);
};

export const getCurvePathPoints = ([[startX, startY], [endX, endY]]: Pair<Point>): PathPoints => [
  createPoint(startX, startY),
  createPoint(endX, endY),
];

export const getStraightConnectedPathPoints = (
  startEndPoints: Pair<Point>,
  { targetIsBlock, sourceBlockEndY }: { targetIsBlock: boolean; sourceBlockEndY: number | null }
): PathPoints => {
  if (isTargetPortWithDoubleOffsetToRightOfSourcePort(startEndPoints)) {
    return getRightZLikePathPoints(startEndPoints, { targetIsBlock });
  }

  if (isTargetPortWithOffsetToRightOfSourceBlockCenter(startEndPoints)) {
    if (targetIsBlock && isTargetPortWithoutTopOffsetUnderSourcePortWithDoubleOffset(startEndPoints)) {
      return getRightJLikeToTopPathPoints(startEndPoints);
    }

    return getRightSLikePathPoints(startEndPoints, { targetIsBlock });
  }

  if (isTargetPortToRightOfSourceBlockCenter(startEndPoints)) {
    if (targetIsBlock && isTargetPortWithoutTopOffsetUnderSourcePortWithDoubleOffset(startEndPoints)) {
      return getRightSLikeToTopPathPoints(startEndPoints, { sourceBlockEndY });
    }

    return getRightJLikePathPoints(startEndPoints, { targetIsBlock });
  }

  if (isTargetBlockCenterToRightOfStartOfSourceBlock(startEndPoints)) {
    if (targetIsBlock && isTargetPortWithoutTopOffsetUnderSourcePortWithDoubleOffset(startEndPoints)) {
      return isTargetBlockCenterToRightOfSourceBlockCenter(startEndPoints)
        ? getRightSLikeToTopPathPoints(startEndPoints, { sourceBlockEndY })
        : getLeftSLikeToTopPathPoints(startEndPoints, { sourceBlockEndY });
    }

    return getLeftJLikePathPoints(startEndPoints, { targetIsBlock });
  }

  if (isTargetBlockEndWithDoubleOffsetToRightOfStartOfSourceBlock(startEndPoints)) {
    if (targetIsBlock && isTargetPortWithoutTopOffsetUnderSourcePortWithDoubleOffset(startEndPoints)) {
      return isTargetBlockCenterWithOffsetToRightOfStartOfSourceBlock(startEndPoints)
        ? getLeftSLikeToTopPathPoints(startEndPoints, { sourceBlockEndY })
        : getLeftJLikeToTopPathPoints(startEndPoints);
    }

    return getLeftSLikePathPoints(startEndPoints, { targetIsBlock });
  }

  return getLeftZLikePathPoints(startEndPoints, { targetIsBlock });
};

const getStraightUnconnectedPathPoints = (startEndPoints: Pair<Point>): PathPoints => {
  if (isTargetPortWithOffsetToRightOfSourcePort(startEndPoints)) {
    return getUnconnectedRightZLikePathPoints(startEndPoints);
  }

  if (isTargetPortToRightOfSourceBlockCenter(startEndPoints)) {
    return getUnconnectedRightJLikePathPoints(startEndPoints);
  }

  if (isTargetPortWithOffsetToRightOfStartOfSourceBlock(startEndPoints)) {
    return getUnconnectedLeftJLikePathPoints(startEndPoints);
  }

  return getUnconnectedLeftZLikePathPoints(startEndPoints);
};

const getRightZLikePathPoints = ([[startX, startY], [endX, endY]]: Pair<Point>, { targetIsBlock }: { targetIsBlock: boolean }): PathPoints => {
  const offsetX = getPointsOffset(startX, endX);
  const halfOffsetX = offsetX / 2;

  const startXWithHalfOffsetX = startX + halfOffsetX;

  if (isLessThanMinPathOffset(startY, endY)) {
    return [createPoint(startX, startY), createPoint(endX, endY, { allowedToTop: targetIsBlock })];
  }

  return [
    createPoint(startX, startY),
    createPoint(startXWithHalfOffsetX, startY),
    createPoint(startXWithHalfOffsetX, endY),
    createPoint(endX, endY, { allowedToTop: targetIsBlock }),
  ];
};

const getRightSLikePathPoints = ([[startX, startY], [endX, endY]]: Pair<Point>, { targetIsBlock }: { targetIsBlock: boolean }): PathPoints => {
  const offsetY = getPointsOffset(startY, endY);

  const halfOffsetY = offsetY / 2;
  const startXWithPathOffset = startX + STRAIGHT_PATH_OFFSET;
  const endXWithoutPathOffset = endX - STRAIGHT_PATH_OFFSET;
  const startYWithHalfOffsetY = startY + halfOffsetY;

  if (isLessThanMinPathOffset(startY, endY)) {
    return [createPoint(startX, startY), createPoint(endX, endY, { allowedToTop: targetIsBlock })];
  }

  return [
    createPoint(startX, startY),
    createPoint(startXWithPathOffset, startY),
    createPoint(startXWithPathOffset, startYWithHalfOffsetY),
    createPoint(endXWithoutPathOffset, startYWithHalfOffsetY),
    createPoint(endXWithoutPathOffset, endY),
    createPoint(endX, endY, { allowedToTop: targetIsBlock }),
  ];
};

const getRightSLikeToTopPathPoints = (
  [[startX, startY], [endX, endY]]: Pair<Point>,
  { sourceBlockEndY }: { sourceBlockEndY: number | null }
): PathPoints => {
  const endYWithoutOffset = endY - TOP_PORT_OFFSET;

  const offsetY = getPointsOffset(startY, endYWithoutOffset);

  const halfOffsetY = offsetY / 2;
  const startXWithPathOffset = startX + STRAIGHT_PATH_OFFSET;
  const endXWithHalfBlockWidth = endX + HALF_BLOCK_WIDTH;
  let startYWithHalfOffsetY = startY + halfOffsetY;

  if (sourceBlockEndY !== null && startYWithHalfOffsetY < sourceBlockEndY + STRAIGHT_PATH_OFFSET) {
    startYWithHalfOffsetY = Math.min(sourceBlockEndY + STRAIGHT_PATH_OFFSET, endYWithoutOffset - STRAIGHT_PATH_OFFSET);
  }

  return [
    createPoint(startX, startY),
    createPoint(startXWithPathOffset, startY),
    createPoint(startXWithPathOffset, startYWithHalfOffsetY),
    createPoint(endXWithHalfBlockWidth, startYWithHalfOffsetY),
    createPoint(endXWithHalfBlockWidth, endYWithoutOffset, { toTop: true, allowedToTop: true }),
  ];
};

const getRightJLikePathPoints = ([[startX, startY], [endX, endY]]: Pair<Point>, { targetIsBlock }: { targetIsBlock: boolean }): PathPoints => {
  const endXWithBlockWidth = endX + BLOCK_WIDTH;
  const endXWithBlockWidthAndPathOffset = endXWithBlockWidth + STRAIGHT_PATH_OFFSET;

  return [
    createPoint(startX, startY),
    createPoint(endXWithBlockWidthAndPathOffset, startY),
    createPoint(endXWithBlockWidthAndPathOffset, endY),
    createPoint(endXWithBlockWidth, endY, { allowedToTop: targetIsBlock, reversed: true }),
  ];
};

const getRightJLikeToTopPathPoints = ([[startX, startY], [endX, endY]]: Pair<Point>): PathPoints => {
  const endYWithoutOffset = endY - TOP_PORT_OFFSET;
  const endXWithHalfBlockWidth = endX + HALF_BLOCK_WIDTH;

  return [
    createPoint(startX, startY),
    createPoint(endXWithHalfBlockWidth, startY),
    createPoint(endXWithHalfBlockWidth, endYWithoutOffset, { toTop: true, allowedToTop: true }),
  ];
};

const getLeftJLikePathPoints = ([[startX, startY], [endX, endY]]: Pair<Point>, { targetIsBlock }: { targetIsBlock: boolean }): PathPoints => {
  const offsetX = getPointsOffset(startX, endX);

  const absOffsetX = Math.abs(offsetX);
  const startXWithoutBlockWidth = startX - BLOCK_WIDTH;
  const startEndXWithoutPathOffset = (absOffsetX < BLOCK_WIDTH ? startXWithoutBlockWidth : endX) - STRAIGHT_PATH_OFFSET;

  return [
    createPoint(startXWithoutBlockWidth, startY, { reversed: true }),
    createPoint(startEndXWithoutPathOffset, startY),
    createPoint(startEndXWithoutPathOffset, endY),
    createPoint(endX, endY, { allowedToTop: targetIsBlock }),
  ];
};

const getLeftJLikeToTopPathPoints = ([[startX, startY], [endX, endY]]: Pair<Point>): PathPoints => {
  const endYWithoutOffset = endY - TOP_PORT_OFFSET;
  const endXWithHalfBlockWidth = endX + HALF_BLOCK_WIDTH;
  const startXWithoutBlockWidth = startX - BLOCK_WIDTH;

  return [
    createPoint(startXWithoutBlockWidth, startY, { reversed: true }),
    createPoint(endXWithHalfBlockWidth, startY),
    createPoint(endXWithHalfBlockWidth, endYWithoutOffset, { toTop: true, allowedToTop: true }),
  ];
};

const getLeftSLikePathPoints = ([[startX, startY], [endX, endY]]: Pair<Point>, { targetIsBlock }: { targetIsBlock: boolean }): PathPoints => {
  const offsetY = getPointsOffset(startY, endY);

  const halfOffsetY = offsetY / 2;
  const endXWithBlockWidth = endX + BLOCK_WIDTH;
  const startXWithoutBlockWidth = startX - BLOCK_WIDTH;

  const endXWithBlockWidthAndPathOffset = endXWithBlockWidth + STRAIGHT_PATH_OFFSET;
  const startXWithoutBlockWidthAndPathOffset = startXWithoutBlockWidth - STRAIGHT_PATH_OFFSET;
  const startYWithHalfOffsetY = startY + halfOffsetY;

  if (isLessThanMinPathOffset(startY, endY)) {
    return [
      createPoint(startXWithoutBlockWidth, startY, { reversed: true }),
      createPoint(endXWithBlockWidth, endY, { reversed: true, allowedToTop: targetIsBlock }),
    ];
  }

  return [
    createPoint(startXWithoutBlockWidth, startY, { reversed: true }),
    createPoint(startXWithoutBlockWidthAndPathOffset, startY),
    createPoint(startXWithoutBlockWidthAndPathOffset, startYWithHalfOffsetY),
    createPoint(endXWithBlockWidthAndPathOffset, startYWithHalfOffsetY),
    createPoint(endXWithBlockWidthAndPathOffset, endY),
    createPoint(endXWithBlockWidth, endY, { reversed: true, allowedToTop: targetIsBlock }),
  ];
};

const getLeftSLikeToTopPathPoints = (
  [[startX, startY], [endX, endY]]: Pair<Point>,
  { sourceBlockEndY }: { sourceBlockEndY: number | null }
): PathPoints => {
  const endYWithoutOffset = endY - TOP_PORT_OFFSET;

  const offsetY = getPointsOffset(startY, endYWithoutOffset);

  const halfOffsetY = offsetY / 2;
  const endXWithHalfBlockWidth = endX + HALF_BLOCK_WIDTH;
  const startXWithoutBlockWidth = startX - BLOCK_WIDTH;

  const startXWithoutBlockWidthAndPathOffset = startXWithoutBlockWidth - STRAIGHT_PATH_OFFSET;
  let startYWithHalfOffsetY = startY + halfOffsetY;

  if (sourceBlockEndY !== null && startYWithHalfOffsetY < sourceBlockEndY + STRAIGHT_PATH_OFFSET) {
    startYWithHalfOffsetY = Math.min(sourceBlockEndY + STRAIGHT_PATH_OFFSET, endYWithoutOffset - STRAIGHT_PATH_OFFSET);
  }

  return [
    createPoint(startXWithoutBlockWidth, startY, { reversed: true }),
    createPoint(startXWithoutBlockWidthAndPathOffset, startY),
    createPoint(startXWithoutBlockWidthAndPathOffset, startYWithHalfOffsetY),
    createPoint(endXWithHalfBlockWidth, startYWithHalfOffsetY),
    createPoint(endXWithHalfBlockWidth, endYWithoutOffset, { toTop: true, allowedToTop: true }),
  ];
};

const getLeftZLikePathPoints = ([[startX, startY], [endX, endY]]: Pair<Point>, { targetIsBlock }: { targetIsBlock: boolean }): PathPoints => {
  const endXWithBlockWidth = endX + BLOCK_WIDTH;
  const startXWithoutBlockWidth = startX - BLOCK_WIDTH;

  const halfOffsetX = (startXWithoutBlockWidth - endXWithBlockWidth) / 2;
  const startWithoutBlockWidthAndHalfOffsetX = startXWithoutBlockWidth - halfOffsetX;

  if (isLessThanMinPathOffset(startY, endY)) {
    return [
      createPoint(startXWithoutBlockWidth, startY, { reversed: true }),
      createPoint(endXWithBlockWidth, endY, { reversed: true, allowedToTop: targetIsBlock }),
    ];
  }

  return [
    createPoint(startXWithoutBlockWidth, startY, { reversed: true }),
    createPoint(startWithoutBlockWidthAndHalfOffsetX, startY),
    createPoint(startWithoutBlockWidthAndHalfOffsetX, endY),
    createPoint(endXWithBlockWidth, endY, { reversed: true, allowedToTop: targetIsBlock }),
  ];
};

const getUnconnectedRightZLikePathPoints = (startEndPoints: Pair<Point>): PathPoints => {
  const [[startX, startY], [endX, endY]] = startEndPoints;
  const offsetX = getPointsOffset(startX, endX);

  if (Math.abs(offsetX) >= DOUBLE_STRAIGHT_PATH_OFFSET) {
    return getRightZLikePathPoints(startEndPoints, { targetIsBlock: false });
  }

  const startXWithOffset = startX + STRAIGHT_PATH_OFFSET;

  return [createPoint(startX, startY), createPoint(startXWithOffset, startY), createPoint(startXWithOffset, endY), createPoint(endX, endY)];
};

const getUnconnectedRightJLikePathPoints = ([[startX, startY], [endX, endY]]: Pair<Point>): PathPoints => {
  const startXWithPathOffset = startX + STRAIGHT_PATH_OFFSET;

  return [createPoint(startX, startY), createPoint(startXWithPathOffset, startY), createPoint(startXWithPathOffset, endY), createPoint(endX, endY)];
};

const getUnconnectedLeftJLikePathPoints = ([[startX, startY], [endX, endY]]: Pair<Point>): PathPoints => {
  const startXWithoutBlockWidth = startX - BLOCK_WIDTH;
  const startXWithoutBlockWidthAndPathOffset = startXWithoutBlockWidth - STRAIGHT_PATH_OFFSET;

  return [
    createPoint(startXWithoutBlockWidth, startY, { reversed: true }),
    createPoint(startXWithoutBlockWidthAndPathOffset, startY),
    createPoint(startXWithoutBlockWidthAndPathOffset, endY),
    createPoint(endX, endY),
  ];
};

const getUnconnectedLeftZLikePathPoints = ([[startX, startY], [endX, endY]]: Pair<Point>): PathPoints => {
  const startXWithoutBlockWidth = startX - BLOCK_WIDTH;
  const halfOffsetX = (startXWithoutBlockWidth - endX) / 2;

  if (halfOffsetX < STRAIGHT_PATH_OFFSET) {
    const startWithoutBlockWidthAndOffset = startXWithoutBlockWidth - STRAIGHT_PATH_OFFSET;

    return [
      createPoint(startXWithoutBlockWidth, startY, { reversed: true }),
      createPoint(startWithoutBlockWidthAndOffset, startY),
      createPoint(startWithoutBlockWidthAndOffset, endY),
      createPoint(endX, endY),
    ];
  }

  const startWithoutBlockWidthAndHalfOffsetX = startXWithoutBlockWidth - halfOffsetX;

  return [
    createPoint(startXWithoutBlockWidth, startY, { reversed: true }),
    createPoint(startWithoutBlockWidthAndHalfOffsetX, startY),
    createPoint(startWithoutBlockWidthAndHalfOffsetX, endY),
    createPoint(endX, endY),
  ];
};
