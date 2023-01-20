import { PlanType } from '@voiceflow/internal';

import { Permission } from '@/constants/permissions';
import { ENTERPRISE_PLANS } from '@/constants/plans';
import * as Tracking from '@/ducks/tracking';
import { getUpgradeModalProps } from '@/utils/upgrade';

import { UpgradeModalPlanPermission } from './types';

export const NLU_CONFLICTS_PERMISSIONS = {
  plans: ENTERPRISE_PLANS,
  permission: Permission.NLU_CONFLICTS,

  upgradeModal: () => ({
    ...getUpgradeModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.NLU_CONFLICTS),
    title: 'Need to view intent conflicts?',
    header: 'Intent Conflicts',
    description: 'Viewing intent conflicts is an enterprise feature. Please contact sales to unlock.',
  }),
} satisfies UpgradeModalPlanPermission;
