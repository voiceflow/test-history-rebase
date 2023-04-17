import { PlanType } from '@voiceflow/internal';

import { LimitType } from '@/constants/limits';
import * as Tracking from '@/ducks/tracking';
import { getUpgradeModalProps } from '@/utils/upgrade';

import { PlanLimit, UpgradeModalDynamicLimit } from './types';
import { applyEnterpriseLimits, applyStarterLimits, applyTeamLimits } from './utils';

const DEFAULT_MODAL = {
  title: 'Need more assistants?',
  header: 'New Assistant',
};

const STARTER_LIMIT = {
  upgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeModalProps(PlanType.TEAM, Tracking.UpgradePrompt.PROJECT_LIMIT),
    description: `You've reached your ${limit} free assistant limit. Upgrade to team for unlimited assistants.`,
  }),
} satisfies UpgradeModalDynamicLimit;

const TEAM_ENTERPRISE_LIMIT = {
  upgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.PROJECT_LIMIT),
    description: `You've reached your ${limit} assistant limit. Contact us to increase assistant limits.`,
  }),
} satisfies UpgradeModalDynamicLimit;

export const PROJECTS_LIMITS = {
  limit: LimitType.PROJECTS,
  limits: {
    ...applyTeamLimits(TEAM_ENTERPRISE_LIMIT),
    ...applyStarterLimits(STARTER_LIMIT),
    ...applyEnterpriseLimits(TEAM_ENTERPRISE_LIMIT),
  },
} satisfies PlanLimit;
