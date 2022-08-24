import { PlanLimit, ToastErrorLimit } from './types';
import { applyEnterpriseLimits, applyStarterLimits, applyTeamLimits } from './utils';

const getErrorMessage = (limitMB: number): string => `File size must not exceed ${limitMB}MBs`;

const STARTER_LIMIT: ToastErrorLimit = {
  value: 4,
  error: getErrorMessage(4),
};

const TEAM_LIMIT: ToastErrorLimit = {
  value: 40,
  error: getErrorMessage(40),
};

const ENTERPRISE_LIMIT: ToastErrorLimit = {
  value: 200,
  error: getErrorMessage(200),
};

export const MARKUP_VIDEO_LIMITS: PlanLimit<ToastErrorLimit> = {
  ...applyTeamLimits(TEAM_LIMIT),
  ...applyStarterLimits(STARTER_LIMIT),
  ...applyEnterpriseLimits(ENTERPRISE_LIMIT),
};
