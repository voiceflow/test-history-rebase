import type { PathPoints } from '@/types';

import type { LinkedRects } from '../types';
import getCurvePathPoints from './curve';
import getStraightConnectedPoints from './straightConnected';
import getStraightUnconnectedPoints from './straightUnconnected';
import type { GetPathPointsOptions } from './types';

export * from './helpers';
export type { GetPathPointsOptions } from './types';

export const getPathPoints = (linkedRects: LinkedRects, options: GetPathPointsOptions): PathPoints => {
  if (!options.isStraight) {
    return getCurvePathPoints(linkedRects, options);
  }

  if (options.isConnected) {
    return getStraightConnectedPoints(linkedRects, options);
  }

  return getStraightUnconnectedPoints(linkedRects, options);
};
