import { PlanLimit, ToastErrorStaticLimit } from './types';
import { applyAllLimits } from './utils';

const LIMIT: ToastErrorStaticLimit = {
  limit: 4,
  getToastError: ({ limit }) => `File size must not exceed ${limit}MBs`,
};

export const MARKUP_IMAGE_LIMITS: PlanLimit<ToastErrorStaticLimit> = {
  ...applyAllLimits(LIMIT),
};
