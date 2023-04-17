import { PlanType } from '@voiceflow/internal';

import { Permission } from '@/constants/permissions';
import { TEAM_PLUS_PLANS } from '@/constants/plans';
import * as Tracking from '@/ducks/tracking';
import { getUpgradeModalProps } from '@/utils/upgrade';

import { UpgradeModalPlanPermission } from './types';

export const BULK_UPLOAD_PERMISSIONS = {
  plans: [...TEAM_PLUS_PLANS, PlanType.STUDENT],
  permission: Permission.BULK_UPLOAD,

  upgradeModal: () => ({
    ...getUpgradeModalProps(PlanType.TEAM, Tracking.UpgradePrompt.IMPORT_NLU),
    title: 'Need to import NLU data?',
    header: 'NLU Import',
    description: 'NLU import is a team feature. Please upgrade to team to continue.',
  }),
} satisfies UpgradeModalPlanPermission;
