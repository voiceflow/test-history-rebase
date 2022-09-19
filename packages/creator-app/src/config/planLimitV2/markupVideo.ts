import { PlanLimit, ToastErrorValueLimit } from './types';
import { applyEnterpriseLimits, applyStarterLimits, applyTeamLimits } from './utils';

const getToastError = (limit: { limit: number }): string => `File size must not exceed ${limit}MBs`;

const STARTER_LIMIT: ToastErrorValueLimit = {
  value: 4,
  getToastError,
};

const TEAM_LIMIT: ToastErrorValueLimit = {
  value: 40,
  getToastError,
};

const ENTERPRISE_LIMIT: ToastErrorValueLimit = {
  value: 200,
  getToastError,
};

export const MARKUP_VIDEO_LIMITS: PlanLimit<ToastErrorValueLimit> = {
  ...applyTeamLimits(TEAM_LIMIT),
  ...applyStarterLimits(STARTER_LIMIT),
  ...applyEnterpriseLimits(ENTERPRISE_LIMIT),
};
