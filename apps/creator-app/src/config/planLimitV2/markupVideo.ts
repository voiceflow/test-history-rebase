import { LimitType } from '@/constants/limits';

import { ErrorRenderer, PlanLimit, ToastErrorStaticLimit } from './types';
import { applyEnterpriseLimits, applyStarterLimits, applyTeamLimits } from './utils';

const toastError: ErrorRenderer = ({ limit }): string => `File size must not exceed ${limit}MBs`;

const STARTER_LIMIT = {
  limit: 4,
  toastError,
} satisfies ToastErrorStaticLimit;

const TEAM_LIMIT = {
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
    ...applyTeamLimits(TEAM_LIMIT),
    ...applyStarterLimits(STARTER_LIMIT),
    ...applyEnterpriseLimits(ENTERPRISE_LIMIT),
  },
} satisfies PlanLimit;
