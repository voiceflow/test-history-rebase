import { PlanType } from '@voiceflow/internal';

import * as Tracking from '@/ducks/tracking';
import { getUpgradeToModalProps } from '@/utils/upgrade';

import { PlanLimit, UpgradeModalDynamicLimit } from './types';
import { applyEnterpriseLimits, applyStarterLimits, applyTeamLimits } from './utils';

const DEFAULT_MODAL = {
  title: 'Need more Editor seats?',
  header: 'Add Members',
};

const TEAM_INCREASE_LIMIT = 5;

const STARTER_LIMIT: UpgradeModalDynamicLimit = {
  getUpgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeToModalProps(PlanType.TEAM, Tracking.UpgradePrompt.EDITOR_SEATS),
    description: `You've reached ${limit} editor seats limit allowed in your workspace. Upgrade to team to unlock up to ${TEAM_INCREASE_LIMIT} editor seats.`,
  }),
};

export const TEAM_LIMIT: UpgradeModalDynamicLimit = {
  getUpgradeModal: ({ increasableLimit = 5 }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeToModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.EDITOR_SEATS),
    description: `You've reached ${increasableLimit} editor seats limit allowed in your workspace. Contact sales to unlock more.`,
  }),
  increasableLimit: TEAM_INCREASE_LIMIT,
};

const ENTERPRISE_LIMIT: UpgradeModalDynamicLimit = {
  getUpgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeToModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.EDITOR_SEATS),
    title: 'Need more Editor seats?',
    header: 'Add Members',
    description: `You've reached ${limit} editor seats limit allowed in your workspace. Contact sales to unlock more.`,
  }),
  increasableLimit: Infinity,
};

export const EDITOR_SEATS_LIMITS: PlanLimit<UpgradeModalDynamicLimit> = {
  ...applyTeamLimits(TEAM_LIMIT),
  ...applyStarterLimits(STARTER_LIMIT),
  ...applyEnterpriseLimits(ENTERPRISE_LIMIT),
};
