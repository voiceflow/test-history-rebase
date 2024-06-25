import { LimitType } from '@/constants/limits';

import type { ErrorRenderer, PlanLimit, ToastErrorStaticLimit } from './types';
import {
  applyEnterpriseLimits,
  applyPersonalLimits,
  applyProLimits,
  applyStarterLimits,
  applyTeamLimits,
} from './utils';

const toastError: ErrorRenderer = ({ limit }): string => `File size must not exceed ${limit}MBs`;

const STARTER_LIMIT = {
  limit: 4,
  toastError,
} satisfies ToastErrorStaticLimit;

const PERSONAL_PRO_TEAM_LIMIT = {
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
    ...applyStarterLimits(STARTER_LIMIT),
    ...applyPersonalLimits(PERSONAL_PRO_TEAM_LIMIT),
    ...applyProLimits(PERSONAL_PRO_TEAM_LIMIT),
    ...applyTeamLimits(PERSONAL_PRO_TEAM_LIMIT),
    ...applyEnterpriseLimits(ENTERPRISE_LIMIT),
  },
} satisfies PlanLimit;
