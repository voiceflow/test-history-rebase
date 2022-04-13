import { PlanType } from '@voiceflow/internal';

import { STARTER_LIMIT_PLANS, TEAM_LIMIT_PLANS, VariableStatesLimitDetails } from './constants';
import { LimitDetails, VariableStatesLimits } from './types';

// eslint-disable-next-line import/prefer-default-export
export const getPlanLimitDetails = (plan: PlanType): LimitDetails | null => {
  if (TEAM_LIMIT_PLANS.includes(plan)) {
    return VariableStatesLimitDetails[VariableStatesLimits.TEAM];
  }

  if (STARTER_LIMIT_PLANS.includes(plan)) {
    return VariableStatesLimitDetails[VariableStatesLimits.STARTER];
  }

  return null;
};
