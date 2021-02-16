import { Pair, Point } from '@/types';

import {
  isTargetBlockCenterToRightOfStartOfSourceBlock,
  isTargetBlockEndWithDoubleOffsetToRightOfStartOfSourceBlock,
  isTargetPortToRightOfSourceBlockCenter,
  isTargetPortWithDoubleOffsetToRightOfSourcePort,
  isTargetPortWithOffsetToRightOfSourceBlockCenter,
  isTargetPortWithOffsetToRightOfSourcePort,
  isTargetPortWithOffsetToRightOfStartOfSourceBlock,
  isTargetPortWithoutTopOffsetUnderSourcePortWithDoubleOffset,
} from './path';

export const buildHeadMarker = (id: string): string => `url(#head-${id})`;

export type MarkerAttrs = { orient: string };

const TOP_MARKER_ATTRS = { orient: '90deg' };
const DEFAULT_MARKER_ATTRS = { orient: '0deg' };
const REVERTED_MARKER_ATTRS = { orient: '180deg' };

export const getMarkerAttrs = (
  points: Pair<Point> | null,
  { straight = false, unconnected = false, targetIsBlock = false }: { straight?: boolean; unconnected?: boolean; targetIsBlock?: boolean }
): MarkerAttrs => {
  return !points || !straight ? DEFAULT_MARKER_ATTRS : getStraightMarkerAttrs(points, { unconnected, targetIsBlock });
};

const getStraightMarkerAttrs = (points: Pair<Point>, { unconnected, targetIsBlock }: { unconnected: boolean; targetIsBlock: boolean }): MarkerAttrs =>
  unconnected ? getStraightUnconnectedMarkerAttrs(points) : getStraightConnectedMarkerAttrs(points, { targetIsBlock });

const getStraightConnectedMarkerAttrs = (points: Pair<Point>, { targetIsBlock }: { targetIsBlock: boolean }): MarkerAttrs => {
  if (isTargetPortWithDoubleOffsetToRightOfSourcePort(points)) {
    return DEFAULT_MARKER_ATTRS;
  }

  if (isTargetPortWithOffsetToRightOfSourceBlockCenter(points)) {
    if (targetIsBlock && isTargetPortWithoutTopOffsetUnderSourcePortWithDoubleOffset(points)) {
      return TOP_MARKER_ATTRS;
    }

    return DEFAULT_MARKER_ATTRS;
  }

  if (isTargetPortToRightOfSourceBlockCenter(points)) {
    if (targetIsBlock && isTargetPortWithoutTopOffsetUnderSourcePortWithDoubleOffset(points)) {
      return TOP_MARKER_ATTRS;
    }

    return REVERTED_MARKER_ATTRS;
  }

  if (isTargetBlockCenterToRightOfStartOfSourceBlock(points)) {
    if (targetIsBlock && isTargetPortWithoutTopOffsetUnderSourcePortWithDoubleOffset(points)) {
      return TOP_MARKER_ATTRS;
    }

    return DEFAULT_MARKER_ATTRS;
  }

  if (isTargetBlockEndWithDoubleOffsetToRightOfStartOfSourceBlock(points)) {
    if (targetIsBlock && isTargetPortWithoutTopOffsetUnderSourcePortWithDoubleOffset(points)) {
      return TOP_MARKER_ATTRS;
    }

    return REVERTED_MARKER_ATTRS;
  }

  return REVERTED_MARKER_ATTRS;
};

const getStraightUnconnectedMarkerAttrs = (points: Pair<Point>): MarkerAttrs => {
  if (isTargetPortWithOffsetToRightOfSourcePort(points)) {
    return DEFAULT_MARKER_ATTRS;
  }

  if (isTargetPortToRightOfSourceBlockCenter(points)) {
    return REVERTED_MARKER_ATTRS;
  }

  if (isTargetPortWithOffsetToRightOfStartOfSourceBlock(points)) {
    return DEFAULT_MARKER_ATTRS;
  }

  return REVERTED_MARKER_ATTRS;
};
