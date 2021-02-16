import { BLOCK_WIDTH } from '@/styles/theme';
import { Pair, Point } from '@/types';

import { STRAIGHT_PATH_OFFSET } from '../constants';
import {
  getOffset,
  HALF_BLOCK_WIDTH,
  isTargetBlockCenterToRightOfSourceBlockCenter,
  isTargetBlockCenterToRightOfStartOfSourceBlock,
  isTargetBlockCenterWithOffsetToRightOfStartOfSourceBlock,
  isTargetBlockEndWithDoubleOffsetToRightOfStartOfSourceBlock,
  isTargetPortToRightOfSourceBlockCenter,
  isTargetPortWithDoubleOffsetToRightOfSourcePort,
  isTargetPortWithOffsetToRightOfSourceBlockCenter,
  isTargetPortWithoutTopOffsetUnderSourcePortWithDoubleOffset,
  TOP_PORT_OFFSET,
} from './path';

export const buildCenter = (
  points: Pair<Point> | null,
  { straight, targetIsBlock = false, sourceBlockEndY = null }: { straight?: boolean; targetIsBlock?: boolean; sourceBlockEndY?: number | null } = {}
): Point | null => {
  if (!points) return null;

  return straight ? buildStraightCenter(points, { targetIsBlock, sourceBlockEndY }) : buildCurveCenter(points);
};

const getYCenter = (startY: number, endY: number) => startY + (endY - startY) / 2;
const getYCenterForBlock = (startY: number, endY: number, sourceBlockEndY: number | null) => {
  const endYWithoutOffset = endY - TOP_PORT_OFFSET;
  const offsetY = getOffset(endYWithoutOffset, startY);
  const halfOffsetY = offsetY / 2;
  const startYWithHalfOffsetY = startY + halfOffsetY;

  if (sourceBlockEndY !== null && startYWithHalfOffsetY < sourceBlockEndY + STRAIGHT_PATH_OFFSET) {
    return Math.min(sourceBlockEndY + STRAIGHT_PATH_OFFSET, endYWithoutOffset - STRAIGHT_PATH_OFFSET);
  }

  return startY + (endY - TOP_PORT_OFFSET - startY) / 2;
};

export const buildCurveCenter = ([[startX, startY], [endX, endY]]: Pair<Point>): Point => [startX + (endX - startX) / 2, getYCenter(startY, endY)];

export const buildStraightCenter = (
  points: Pair<Point>,
  { targetIsBlock, sourceBlockEndY }: { targetIsBlock: boolean; sourceBlockEndY: number | null }
): Point => {
  if (isTargetPortWithDoubleOffsetToRightOfSourcePort(points)) {
    return buildCurveCenter(points);
  }

  if (isTargetPortWithOffsetToRightOfSourceBlockCenter(points)) {
    if (targetIsBlock && isTargetPortWithoutTopOffsetUnderSourcePortWithDoubleOffset(points)) {
      const [[, startY], [endX, endY]] = points;

      return [endX + HALF_BLOCK_WIDTH, getYCenterForBlock(startY, endY, null)];
    }

    return buildCurveCenter(points);
  }

  if (isTargetPortToRightOfSourceBlockCenter(points)) {
    const [[startX, startY], [endX, endY]] = points;

    if (targetIsBlock && isTargetPortWithoutTopOffsetUnderSourcePortWithDoubleOffset(points)) {
      return [startX + (endX + HALF_BLOCK_WIDTH + STRAIGHT_PATH_OFFSET - startX) / 2, getYCenterForBlock(startY, endY, sourceBlockEndY)];
    }

    return [endX + BLOCK_WIDTH + STRAIGHT_PATH_OFFSET, getYCenter(startY, endY)];
  }

  if (isTargetBlockCenterToRightOfStartOfSourceBlock(points)) {
    const [[startX, startY], [endX, endY]] = points;

    if (targetIsBlock && isTargetPortWithoutTopOffsetUnderSourcePortWithDoubleOffset(points)) {
      return isTargetBlockCenterToRightOfSourceBlockCenter(points)
        ? [startX + (endX + HALF_BLOCK_WIDTH + STRAIGHT_PATH_OFFSET - startX) / 2, getYCenterForBlock(startY, endY, sourceBlockEndY)]
        : [startX + (endX - STRAIGHT_PATH_OFFSET - startX - HALF_BLOCK_WIDTH) / 2, getYCenterForBlock(startY, endY, sourceBlockEndY)];
    }

    return isTargetBlockCenterToRightOfSourceBlockCenter(points)
      ? [startX - BLOCK_WIDTH - STRAIGHT_PATH_OFFSET, getYCenter(startY, endY)]
      : [endX - STRAIGHT_PATH_OFFSET, getYCenter(startY, endY)];
  }

  if (isTargetBlockEndWithDoubleOffsetToRightOfStartOfSourceBlock(points)) {
    const [[startX, startY], [endX, endY]] = points;

    if (targetIsBlock && isTargetPortWithoutTopOffsetUnderSourcePortWithDoubleOffset(points)) {
      return isTargetBlockCenterWithOffsetToRightOfStartOfSourceBlock(points)
        ? [startX + (endX - STRAIGHT_PATH_OFFSET - startX - HALF_BLOCK_WIDTH) / 2, getYCenterForBlock(startY, endY, sourceBlockEndY)]
        : [endX + HALF_BLOCK_WIDTH, getYCenterForBlock(startY, endY, null)];
    }

    return buildCurveCenter(points);
  }

  return buildCurveCenter(points);
};
