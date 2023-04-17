import { PlanType } from '@voiceflow/internal';

import { LimitType } from '@/constants/limits';
import * as Tracking from '@/ducks/tracking';
import { getUpgradeModalProps } from '@/utils/upgrade';

import { PlanLimit, UpgradeModalDynamicLimit } from './types';
import { applyEnterpriseLimits, applyStarterLimits, applyTeamLimits } from './utils';

const STARTER_TEAM_ENTERPRISE_LIMIT = {
  upgradeModal: ({ limit }) => ({
    ...getUpgradeModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.VIEWER_SEATS),
    title: 'Need more Viewer seats?',
    header: 'Add Members',
    description: `You've reached ${limit} viewer seats limit allowed in your workspace. Contact sales to unlock more.`,
  }),
} satisfies UpgradeModalDynamicLimit;

export const VIEWER_SEATS_LIMITS = {
  limit: LimitType.VIEWER_SEATS,
  limits: {
    ...applyTeamLimits(STARTER_TEAM_ENTERPRISE_LIMIT),
    ...applyStarterLimits(STARTER_TEAM_ENTERPRISE_LIMIT),
    ...applyEnterpriseLimits(STARTER_TEAM_ENTERPRISE_LIMIT),
  },
} satisfies PlanLimit;
