import { PlanType } from '@voiceflow/internal';

import { Permission } from '@/constants/permissions';
import { PRO_PLUS_PLANS } from '@/constants/plans';
import * as Tracking from '@/ducks/tracking';
import { getUpgradeModalProps } from '@/utils/upgrade';

import type { UpgradeModalPlanPermission } from './types';

export const BULK_UPLOAD_PERMISSIONS = {
  plans: [...PRO_PLUS_PLANS, PlanType.STUDENT],
  permission: Permission.BULK_UPLOAD,

  upgradeModal: () => ({
    ...getUpgradeModalProps(PlanType.PRO, Tracking.UpgradePrompt.IMPORT_NLU),
    title: 'Need to import NLU data?',
    header: 'NLU Import',
    description: 'NLU import is a pro feature. Please upgrade to pro to continue.',
  }),
} satisfies UpgradeModalPlanPermission;
