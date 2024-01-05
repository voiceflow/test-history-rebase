import { PlanType } from '@voiceflow/internal';

import { Permission } from '@/constants/permissions';
import { TEAM_PLUS_PLANS } from '@/constants/plans';
import * as Tracking from '@/ducks/tracking';
import { getUpgradeTooltipProps } from '@/utils/upgrade';

import { UpgradeTooltipPlanPermission } from './types';

export const KB_REFRESH_RATE_PERMISSIONS = {
  plans: TEAM_PLUS_PLANS,
  permission: Permission.KB_REFRESH_RATE,

  upgradeTooltip: () => ({
    ...getUpgradeTooltipProps(PlanType.TEAM, Tracking.UpgradePrompt.KB_REFRESH_RATE),
    title: 'Upgrade to Team',
    description: 'Refresh rate is a team feature.',
  }),
} satisfies UpgradeTooltipPlanPermission;
