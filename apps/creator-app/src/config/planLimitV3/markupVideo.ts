import { PlanType } from '@voiceflow/internal';

import { LimitType } from '@/constants/limits';

import type { ErrorRenderer, LimitV3, ToastErrorStaticLimit } from './types';

const toastError: ErrorRenderer = ({ limit }): string => `File size must not exceed ${limit}MBs`;

const STARTER_LIMIT = {
  limit: 4,
  toastError,
} satisfies ToastErrorStaticLimit;

const PRO_TEAM_LIMIT = {
  limit: 40,
  toastError,
} satisfies ToastErrorStaticLimit;

const ENTERPRISE_LIMIT = {
  limit: 200,
  toastError,
} satisfies ToastErrorStaticLimit;

export const MARKUP_VIDEO_LIMITS = {
  limit: LimitType.MARKUP_VIDEO,
  limits: {
    [PlanType.STARTER]: STARTER_LIMIT,
    [PlanType.PRO]: PRO_TEAM_LIMIT,
    [PlanType.TEAM]: PRO_TEAM_LIMIT,
    [PlanType.ENTERPRISE]: ENTERPRISE_LIMIT,
  },
} satisfies LimitV3;
