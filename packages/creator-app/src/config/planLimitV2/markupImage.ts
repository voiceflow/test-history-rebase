import { PlanLimit, ToastErrorLimit } from './types';
import { applyAllLimits } from './utils';

const LIMIT: ToastErrorLimit = {
  value: 4,
  error: `File size must not exceed ${4}MBs`,
};

export const MARKUP_IMAGE_LIMITS: PlanLimit<ToastErrorLimit> = {
  ...applyAllLimits(LIMIT),
};
