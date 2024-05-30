import { PlanType } from '@voiceflow/internal';

import { LimitType } from '@/constants/limits';
import * as Tracking from '@/ducks/tracking';
import { getLegacyUpgradeModalProps } from '@/utils/upgrade';

import { PlanLimit, UpgradeModalStaticLimit } from './types';
import { applyPersonalLimits, applyProLimits, applyStarterLimits, applyTeamLimits } from './utils';

const DEFAULT_MODAL = {
  title: 'Need to design larger agents?',
  header: 'Domains',
};

const STARTER_LIMIT = {
  limit: 1,
  upgradeModal: () => ({
    ...DEFAULT_MODAL,
    ...getLegacyUpgradeModalProps(PlanType.PRO, Tracking.UpgradePrompt.DOMAINS),
    description: `Upgrade to pro to unlock ${PERSONAL_PRO_TEAM_LIMIT.limit} domains for all agents in your workspace.`,
  }),
} satisfies UpgradeModalStaticLimit;

const PERSONAL_PRO_TEAM_LIMIT = {
  limit: 3,
  upgradeModal: () => ({
    ...DEFAULT_MODAL,
    ...getLegacyUpgradeModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.DOMAINS),
    description: 'Upgrade to enterprise to unlock unlimited domains for all agents in your workspace.',
  }),
} satisfies UpgradeModalStaticLimit;

export const DOMAINS_LIMITS = {
  limit: LimitType.DOMAINS,
  limits: {
    ...applyStarterLimits(STARTER_LIMIT),
    ...applyPersonalLimits(PERSONAL_PRO_TEAM_LIMIT),
    ...applyProLimits(PERSONAL_PRO_TEAM_LIMIT),
    ...applyTeamLimits(PERSONAL_PRO_TEAM_LIMIT),
  },
} satisfies PlanLimit;
