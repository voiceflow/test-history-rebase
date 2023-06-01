import { PlanType } from '@voiceflow/internal';

import { EDITOR_DEFAULT_LIMIT } from '@/constants';
import { LimitType } from '@/constants/limits';
import * as Tracking from '@/ducks/tracking';
import { editorPlanSeatLimitsSelector } from '@/ducks/workspaceV2/selectors/active';
import { getUpgradeModalProps } from '@/utils/upgrade';

import { PlanLimit, UpgradeModalDynamicLimit } from './types';
import { applyEnterpriseLimits, applyStarterLimits, applyTeamLimits } from './utils';

const DEFAULT_MODAL = {
  title: 'Need more Editor seats?',
  header: 'Add Members',
};

const STARTER_LIMIT: UpgradeModalDynamicLimit = {
  maxLimitSelector: editorPlanSeatLimitsSelector,

  upgradeModal: ({ limit, maxLimit = EDITOR_DEFAULT_LIMIT }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeModalProps(PlanType.TEAM, Tracking.UpgradePrompt.EDITOR_SEATS),
    description: `You've reached ${limit} editor seats limit allowed in your workspace. Upgrade to team to unlock up to ${maxLimit} editor seats.`,
  }),
};

export const TEAM_LIMIT = {
  maxLimitSelector: editorPlanSeatLimitsSelector,

  upgradeModal: ({ maxLimit = EDITOR_DEFAULT_LIMIT }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.EDITOR_SEATS),
    description: `You've reached ${maxLimit} editor seats limit allowed in your workspace. Contact sales to unlock more.`,
  }),
} satisfies UpgradeModalDynamicLimit;

const ENTERPRISE_LIMIT = {
  maxLimitSelector: () => Infinity,

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
