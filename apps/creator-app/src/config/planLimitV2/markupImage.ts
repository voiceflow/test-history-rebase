import { LimitType } from '@/constants/limits';

import { PlanLimit, ToastErrorStaticLimit } from './types';
import { applyAllLimits } from './utils';

const LIMIT = {
  limit: 4,
  toastError: ({ limit }) => `File size must not exceed ${limit}MBs`,
} satisfies ToastErrorStaticLimit;

export const MARKUP_IMAGE_LIMITS = {
  limit: LimitType.MARKUP_IMAGE,
  limits: applyAllLimits(LIMIT),
} satisfies PlanLimit;
