import { PlanType } from '@voiceflow/internal';

import { LimitType } from '@/constants/limits';
import * as Tracking from '@/ducks/tracking';
import { editorPlanSeatLimitsSelector } from '@/ducks/workspaceV2/selectors/active';
import { getLegacyUpgradeModalProps } from '@/utils/upgrade';

import type { PlanLimit, UpgradeModalDynamicLimit } from './types';
import {
  applyEnterpriseLimits,
  applyPersonalLimits,
  applyProLimits,
  applyStarterLimits,
  applyTeamLimits,
} from './utils';

const DEFAULT_MODAL = {
  title: 'Need more Editor seats?',
  header: 'Add Members',
};

const STARTER_PERSONAL_PRO_LIMIT: UpgradeModalDynamicLimit = {
  maxLimitSelector: editorPlanSeatLimitsSelector,

  upgradeModal: () => ({
    ...DEFAULT_MODAL,
    ...getLegacyUpgradeModalProps(PlanType.TEAM, Tracking.UpgradePrompt.EDITOR_SEATS),
    description: 'Upgrade to the teams plan to unlock more editor seats.',
  }),
};

const TEAM_LIMIT = {
  maxLimitSelector: editorPlanSeatLimitsSelector,

  upgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getLegacyUpgradeModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.EDITOR_SEATS),
    description: `You've reached ${limit} editor seats limit allowed in your workspace. Contact sales to unlock more.`,
  }),
} satisfies UpgradeModalDynamicLimit;

const ENTERPRISE_LIMIT = {
  maxLimitSelector: () => Infinity,

  upgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getLegacyUpgradeModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.EDITOR_SEATS),
    header: 'Add Members',
    description: `You've reached ${limit} editor seats limit allowed in your workspace. Contact sales to unlock more.`,
  }),
} satisfies UpgradeModalDynamicLimit;

export const EDITOR_SEATS_LIMITS = {
  limit: LimitType.EDITOR_SEATS,
  limits: {
    ...applyStarterLimits(STARTER_PERSONAL_PRO_LIMIT),
    ...applyPersonalLimits(STARTER_PERSONAL_PRO_LIMIT),
    ...applyProLimits(STARTER_PERSONAL_PRO_LIMIT),
    ...applyTeamLimits(TEAM_LIMIT),
    ...applyEnterpriseLimits(ENTERPRISE_LIMIT),
  },
} satisfies PlanLimit;
