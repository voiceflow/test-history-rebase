import { PlanType } from '@voiceflow/internal';

import * as Tracking from '@/ducks/tracking';

import { PlanLimit, UpgradeModalDynamicLimit } from './types';
import { applyStarterLimits, applyTeamLimits, getUpgradeToModalProps } from './utils';

const DEFAULT_MODAL = {
  title: 'Need more personas?',
  header: 'Personas',
};

// refactor - get plan limits from backend (VF-3328)
const TEAM_LIMIT_VALUE = 3;

const STARTER_LIMIT: UpgradeModalDynamicLimit = {
  getUpgradeModal: () => ({
    ...DEFAULT_MODAL,
    ...getUpgradeToModalProps(PlanType.TEAM, Tracking.UpgradePrompt.VARIABLE_STATES_LIMIT),
    description: `You’ve used your free persona. Upgrade to team to unlock up to ${TEAM_LIMIT_VALUE} personas.`,
  }),
};

const TEAM_LIMIT: UpgradeModalDynamicLimit = {
  getUpgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeToModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.VARIABLE_STATES_LIMIT),
    description: `You’ve used ${limit}/${limit} personas. Contact sales to unlock unlimited personas.`,
  }),
};

export const VARIABLE_STATES_LIMITS: PlanLimit<UpgradeModalDynamicLimit> = {
  ...applyTeamLimits(TEAM_LIMIT),
  ...applyStarterLimits(STARTER_LIMIT),
};
