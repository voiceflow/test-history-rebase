import { PlanType } from '@voiceflow/internal';

import { LimitType } from '@/constants/limits';

import type { LimitV3, ToastErrorStaticLimit } from './types';

const LIMIT = {
  limit: 4,
  toastError: ({ limit }) => `File size must not exceed ${limit}MBs`,
} satisfies ToastErrorStaticLimit;

export const MARKUP_IMAGE_LIMITS = {
  limit: LimitType.MARKUP_IMAGE,
  limits: {
    [PlanType.STARTER]: LIMIT,
    [PlanType.PRO]: LIMIT,
    [PlanType.TEAM]: LIMIT,
    [PlanType.ENTERPRISE]: LIMIT,
  },
} satisfies LimitV3;
