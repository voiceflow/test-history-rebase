import { LINK_WIDTH } from '@/pages/Canvas/components/Port/constants';
import { Pair, Point } from '@/types';

export * from './lines';
export * from './marker';
export * from './path';
export * from './points';

export const getVirtualPoints = (points: Pair<Point> | null): Pair<Point> | null => {
  if (!points) return null;

  const [[x1, y1], [x2, y2]] = points;

  return [
    [x1 + LINK_WIDTH, y1],
    [x2, y2],
  ];
};
