import { PlanType } from '@voiceflow/internal';

import { Permission } from '@/constants/permissions';
import { PRO_PLUS_PLANS } from '@/constants/plans';
import * as Tracking from '@/ducks/tracking';
import { getUpgradeTooltipProps } from '@/utils/upgrade';

import type { UpgradeTooltipPlanPermission } from './types';

export const KB_REFRESH_RATE_PERMISSIONS = {
  plans: PRO_PLUS_PLANS,
  permission: Permission.KB_REFRESH_RATE,

  upgradeTooltip: () => ({
    ...getUpgradeTooltipProps(PlanType.PRO, Tracking.UpgradePrompt.KB_REFRESH_RATE),
    title: 'Upgrade to Pro',
    description: 'Refresh rate is a pro feature.',
  }),
} satisfies UpgradeTooltipPlanPermission;
