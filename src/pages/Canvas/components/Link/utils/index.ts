import { LINK_WIDTH } from '@/pages/Canvas/components/Port/constants';
import { Pair, Point } from '@/types';

import {
  isTargetBlockCenterToRightOfSourceBlockCenter,
  isTargetPortToRightOfSourceBlockCenter,
  isTargetPortWithoutTopOffsetUnderSourcePortWithDoubleOffset,
} from './path';

export * from './path';
export * from './center';
export * from './marker';

export const getVirtualPoints = (points: Pair<Point> | null): Pair<Point> | null => {
  if (!points) return null;

  const [[x1, y1], [x2, y2]] = points;

  return [
    [x1 + LINK_WIDTH, y1],
    [x2, y2],
  ];
};

export const isPortLinkReversed = (
  points: Pair<Point> | null,
  { straight, targetIsBlock }: { straight?: boolean; targetIsBlock?: boolean } = {}
): boolean => {
  if (!points || !straight) {
    return false;
  }

  if (targetIsBlock && isTargetPortWithoutTopOffsetUnderSourcePortWithDoubleOffset(points)) {
    return !isTargetBlockCenterToRightOfSourceBlockCenter(points);
  }

  return !isTargetPortToRightOfSourceBlockCenter(points);
};
