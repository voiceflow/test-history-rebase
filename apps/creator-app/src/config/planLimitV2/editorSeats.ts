import { PlanType } from '@voiceflow/internal';

import { LimitType } from '@/constants/limits';
import * as Tracking from '@/ducks/tracking';
import { getUpgradeModalProps } from '@/utils/upgrade';

import { PlanLimit, UpgradeModalDynamicLimit } from './types';
import { applyEnterpriseLimits, applyStarterLimits, applyTeamLimits } from './utils';

const DEFAULT_MODAL = {
  title: 'Need more Editor seats?',
  header: 'Add Members',
};

export const TEAM_INCREASE_LIMIT = 5;

const STARTER_LIMIT: UpgradeModalDynamicLimit = {
  upgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeModalProps(PlanType.TEAM, Tracking.UpgradePrompt.EDITOR_SEATS),
    description: `You've reached ${limit} editor seats limit allowed in your workspace. Upgrade to team to unlock up to ${TEAM_INCREASE_LIMIT} editor seats.`,
  }),
};

export const TEAM_LIMIT = {
  increasableLimit: TEAM_INCREASE_LIMIT,

  upgradeModal: ({ increasableLimit = 5 }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.EDITOR_SEATS),
    description: `You've reached ${increasableLimit} editor seats limit allowed in your workspace. Contact sales to unlock more.`,
  }),
} satisfies UpgradeModalDynamicLimit;

const ENTERPRISE_LIMIT = {
  increasableLimit: Infinity,

  upgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.EDITOR_SEATS),
    title: 'Need more Editor seats?',
    header: 'Add Members',
    description: `You've reached ${limit} editor seats limit allowed in your workspace. Contact sales to unlock more.`,
  }),
} satisfies UpgradeModalDynamicLimit;

export const EDITOR_SEATS_LIMITS = {
  limit: LimitType.EDITOR_SEATS,
  limits: {
    ...applyTeamLimits(TEAM_LIMIT),
    ...applyStarterLimits(STARTER_LIMIT),
    ...applyEnterpriseLimits(ENTERPRISE_LIMIT),
  },
} satisfies PlanLimit;
