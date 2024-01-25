import { PlanType } from '@voiceflow/internal';

import { LimitType } from '@/constants/limits';
import * as Tracking from '@/ducks/tracking';
import { getUpgradeModalProps } from '@/utils/upgrade';

import { PlanLimit, UpgradeModalDynamicLimit } from './types';
import { applyEnterpriseLimits, applyPersonalLimits, applyProLimits, applyStarterLimits, applyTeamLimits } from './utils';

const DEFAULT_MODAL = {
  title: 'Need more assistants?',
  header: 'New Assistant',
};

const STARTER_LIMIT = {
  upgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeModalProps(PlanType.PRO, Tracking.UpgradePrompt.PROJECT_LIMIT),
    description: `You've reached your ${limit} free assistant limit. Upgrade to pro for unlimited assistants.`,
  }),
} satisfies UpgradeModalDynamicLimit;

const PERSONAL_PLUS_LIMIT = {
  upgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.PROJECT_LIMIT),
    description: `You've reached your ${limit} assistant limit. Contact us to increase assistant limits.`,
  }),
} satisfies UpgradeModalDynamicLimit;

export const PROJECTS_LIMITS = {
  limit: LimitType.PROJECTS,
  limits: {
    ...applyStarterLimits(STARTER_LIMIT),
    ...applyPersonalLimits(PERSONAL_PLUS_LIMIT),
    ...applyProLimits(PERSONAL_PLUS_LIMIT),
    ...applyTeamLimits(PERSONAL_PLUS_LIMIT),
    ...applyEnterpriseLimits(PERSONAL_PLUS_LIMIT),
  },
} satisfies PlanLimit;
