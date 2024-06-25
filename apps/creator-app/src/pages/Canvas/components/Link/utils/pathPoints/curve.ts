import type { PathPoints } from '@/types';

import type { LinkedRects } from '../types';
import { getRightStraightLinePoints } from './straightHelpers';
import type { GetPathPointsOptions } from './types';

const getCurvePathPoints = (linkedRects: LinkedRects, options: GetPathPointsOptions): PathPoints =>
  getRightStraightLinePoints(linkedRects, options);

export default getCurvePathPoints;
