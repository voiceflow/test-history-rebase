import { PlanLimit, ToastErrorValueLimit } from './types';
import { applyAllLimits } from './utils';

const LIMIT: ToastErrorValueLimit = {
  value: 4,
  getToastError: ({ limit }) => `File size must not exceed ${limit}MBs`,
};

export const MARKUP_IMAGE_LIMITS: PlanLimit<ToastErrorValueLimit> = {
  ...applyAllLimits(LIMIT),
};
