import { PlanType } from '@voiceflow/internal';

import { VIEWERS_DEFAULT_LIMIT } from '@/constants';
import { LimitType } from '@/constants/limits';
import * as Tracking from '@/ducks/tracking';
import { getUpgradeModalProps } from '@/utils/upgrade';

import { LimitV3, UpgradeModalStaticLimit } from './types';

const ALL_PLANS_LIMIT = {
  limit: VIEWERS_DEFAULT_LIMIT,
  upgradeModal: ({ limit }) => ({
    ...getUpgradeModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.VIEWER_SEATS),
    title: 'Need more Viewer seats?',
    header: 'Add Members',
    description: `You've reached ${limit} viewer seats limit allowed in your workspace. Contact sales to unlock more.`,
  }),
} satisfies UpgradeModalStaticLimit;

export const VIEWER_SEATS_LIMITS = {
  limit: LimitType.VIEWER_SEATS,
  limits: {
    [PlanType.STARTER]: ALL_PLANS_LIMIT,
    [PlanType.PRO]: ALL_PLANS_LIMIT,
    [PlanType.TEAM]: ALL_PLANS_LIMIT,
  },
} satisfies LimitV3;
