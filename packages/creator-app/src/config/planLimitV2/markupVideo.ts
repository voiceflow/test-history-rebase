import { ErrorRenderer, PlanLimit, ToastErrorStaticLimit } from '@/config/planLimitV2/types';

import { applyEnterpriseLimits, applyStarterLimits, applyTeamLimits } from './utils';

const getToastError: ErrorRenderer = ({ limit }): string => `File size must not exceed ${limit}MBs`;

const STARTER_LIMIT: ToastErrorStaticLimit = {
  limit: 4,
  getToastError,
};

const TEAM_LIMIT: ToastErrorStaticLimit = {
  limit: 40,
  getToastError,
};

const ENTERPRISE_LIMIT: ToastErrorStaticLimit = {
  limit: 200,
  getToastError,
};

export const MARKUP_VIDEO_LIMITS: PlanLimit<ToastErrorStaticLimit> = {
  ...applyTeamLimits(TEAM_LIMIT),
  ...applyStarterLimits(STARTER_LIMIT),
  ...applyEnterpriseLimits(ENTERPRISE_LIMIT),
};
