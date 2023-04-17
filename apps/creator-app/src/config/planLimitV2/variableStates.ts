import { PlanType } from '@voiceflow/internal';

import { LimitType } from '@/constants/limits';
import * as Tracking from '@/ducks/tracking';
import { getUpgradeModalProps } from '@/utils/upgrade';

import { PlanLimit, UpgradeModalDynamicLimit } from './types';
import { applyStarterLimits, applyTeamLimits } from './utils';

const DEFAULT_MODAL = {
  title: 'Need more personas?',
  header: 'Personas',
};

// refactor - get plan limits from backend (VF-3328)
const TEAM_LIMIT_VALUE = 3;

const STARTER_LIMIT = {
  upgradeModal: () => ({
    ...DEFAULT_MODAL,
    ...getUpgradeModalProps(PlanType.TEAM, Tracking.UpgradePrompt.VARIABLE_STATES_LIMIT),
    description: `You’ve used your free persona. Upgrade to team to unlock up to ${TEAM_LIMIT_VALUE} personas.`,
  }),
} satisfies UpgradeModalDynamicLimit;

const TEAM_LIMIT = {
  upgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.VARIABLE_STATES_LIMIT),
    description: `You’ve used ${limit}/${limit} personas. Contact sales to unlock unlimited personas.`,
  }),
} satisfies UpgradeModalDynamicLimit;

export const VARIABLE_STATES_LIMITS = {
  limit: LimitType.VARIABLE_STATES,
  limits: {
    ...applyTeamLimits(TEAM_LIMIT),
    ...applyStarterLimits(STARTER_LIMIT),
  },
} satisfies PlanLimit;
