import { PlanType } from '@voiceflow/internal';

import * as Tracking from '@/ducks/tracking';
import { getUpgradeToModalProps } from '@/utils/upgrade';

import { PlanLimit, UpgradeModalValueLimit } from './types';
import { applyStarterLimits, applyTeamLimits } from './utils';

const DEFAULT_MODAL = {
  title: 'Need to design larger assistants?',
  header: 'Domains',
};

const TEAM_LIMIT: UpgradeModalValueLimit = {
  value: 3,
  getUpgradeModal: () => ({
    ...DEFAULT_MODAL,
    ...getUpgradeToModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.DOMAINS),
    description: `Upgrade to enterprise to unlock unlimited domains for all assistants in your workspace.`,
  }),
};

const STARTER_LIMIT: UpgradeModalValueLimit = {
  value: 1,
  getUpgradeModal: () => ({
    ...DEFAULT_MODAL,
    ...getUpgradeToModalProps(PlanType.TEAM, Tracking.UpgradePrompt.DOMAINS),
    description: `Upgrade to team to unlock ${TEAM_LIMIT.value} domains for all assistants in your workspace.`,
  }),
};

export const DOMAINS_LIMITS: PlanLimit<UpgradeModalValueLimit> = {
  ...applyTeamLimits(TEAM_LIMIT),
  ...applyStarterLimits(STARTER_LIMIT),
};
