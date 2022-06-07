import { PlanType } from '@voiceflow/internal';

import {
  LimitDetails,
  PlanLimitCategories,
  STARTER_LIMIT_PLANS,
  TEAM_LABEL,
  TEAM_LIMIT_PLANS,
  upgradeToEnterpriseAction,
  upgradeToTeamAction,
} from '@/config/planLimits';

// refactor - get plan limits from backend (VF-3328)
export const VARIABLE_STATES_TEAM_LIMIT = 3;

const VariableStatesLimitDetails: Record<PlanLimitCategories, LimitDetails> = {
  [PlanLimitCategories.STARTER]: {
    modalTitle: 'Personas',
    title: 'Need more personas?',
    description: `You’ve used your free persona. Upgrade to ${TEAM_LABEL} to unlock up to ${VARIABLE_STATES_TEAM_LIMIT} variable states.`,
    submitText: `Upgrade to ${TEAM_LABEL}`,
    onSubmit: upgradeToTeamAction,
  },
  [PlanLimitCategories.TEAM]: {
    modalTitle: 'Personas',
    title: `Need more variable states?`,
    description: `You’ve used ${VARIABLE_STATES_TEAM_LIMIT}/${VARIABLE_STATES_TEAM_LIMIT} personas. Contact sales to unlock unlimited personas.`,
    submitText: 'Contact Sales',
    onSubmit: upgradeToEnterpriseAction,
  },
};

export const getVariableStatesPlanLimitDetails = (plan: PlanType): LimitDetails | null => {
  if (TEAM_LIMIT_PLANS.includes(plan)) {
    return VariableStatesLimitDetails[PlanLimitCategories.TEAM];
  }

  if (STARTER_LIMIT_PLANS.includes(plan)) {
    return VariableStatesLimitDetails[PlanLimitCategories.STARTER];
  }

  return null;
};
