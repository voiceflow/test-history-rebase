import { PlanType } from '@voiceflow/internal';

import { Permission } from '@/constants/permissions';
import { ENTERPRISE_PLANS } from '@/constants/plans';
import * as Tracking from '@/ducks/tracking';
import { getUpgradeModalProps } from '@/utils/upgrade';

import type { UpgradeModalPlanPermission } from './types';

export const WORKSPACE_CREATE_PERMISSIONS = {
  plans: ENTERPRISE_PLANS,
  permission: Permission.WORKSPACE_CREATE,

  upgradeModal: () => ({
    ...getUpgradeModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.WORKSPACE_LIMIT),
    title: 'Need more workspaces?',
    header: 'New Workspace',
    description: 'Multiple workspaces is an enterprise feature. Please contact sales to unlock.',
  }),
} satisfies UpgradeModalPlanPermission;
