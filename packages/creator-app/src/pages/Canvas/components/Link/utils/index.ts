import { NODE_LINK_WIDTH } from '@/pages/Canvas/components/Port/constants';
import { Pair, Point } from '@/types';

export { getPathPoints } from './getPathPoints';
export * from './helpers';
export * from './lines';
export * from './marker';
export * from './path';
export { getPathPointsV2 } from './pathPoints';
export { getPathPointsCenter } from './pointsCenter';
export { syncPointsWithLinkedRects } from './syncPoints';
export type { LinkedRects } from './types';

/**
 *
 * @deprecated
 */
export const getVirtualPoints = (points: Pair<Point> | null): Pair<Point> | null => {
  if (!points) return null;

  const [[x1, y1], [x2, y2]] = points;

  return [
    [x1 + NODE_LINK_WIDTH, y1],
    [x2, y2],
  ];
};
