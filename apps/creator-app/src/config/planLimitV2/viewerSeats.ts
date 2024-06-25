import { PlanType } from '@voiceflow/internal';

import { LimitType } from '@/constants/limits';
import * as Tracking from '@/ducks/tracking';
import { getLegacyUpgradeModalProps } from '@/utils/upgrade';

import type { PlanLimit, UpgradeModalDynamicLimit } from './types';
import { applyAllLimits } from './utils';

const ALL_PLANS_LIMIT = {
  upgradeModal: ({ limit }) => ({
    ...getLegacyUpgradeModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.VIEWER_SEATS),
    title: 'Need more Viewer seats?',
    header: 'Add Members',
    description: `You've reached ${limit} viewer seats limit allowed in your workspace. Contact sales to unlock more.`,
  }),
} satisfies UpgradeModalDynamicLimit;

export const VIEWER_SEATS_LIMITS = {
  limit: LimitType.VIEWER_SEATS,
  limits: {
    ...applyAllLimits(ALL_PLANS_LIMIT),
  },
} satisfies PlanLimit;
