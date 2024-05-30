import { PlanType } from '@voiceflow/internal';

import { LimitType } from '@/constants/limits';
import * as Tracking from '@/ducks/tracking';
import { getLegacyUpgradeModalProps } from '@/utils/upgrade';

import { PlanLimit, UpgradeModalDynamicLimit } from './types';
import { applyEnterpriseLimits, applyPersonalLimits, applyProLimits, applyStarterLimits, applyTeamLimits } from './utils';

const DEFAULT_MODAL = {
  title: 'Need more agents?',
  header: 'New Agent',
};

const STARTER_LIMIT = {
  upgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getLegacyUpgradeModalProps(PlanType.PRO, Tracking.UpgradePrompt.PROJECT_LIMIT),
    description: `You've reached your ${limit} free agent limit. Upgrade to pro for unlimited agents.`,
  }),
} satisfies UpgradeModalDynamicLimit;

const PERSONAL_PLUS_LIMIT = {
  upgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getLegacyUpgradeModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.PROJECT_LIMIT),
    description: `You've reached your ${limit} agent limit. Contact us to increase agent limits.`,
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
