import { PlanType } from '@voiceflow/internal';

import { LimitType } from '@/constants/limits';
import * as Tracking from '@/ducks/tracking';
import { getUpgradeModalProps } from '@/utils/upgrade';

import { LimitV3, UpgradeModalEntitlementLimit } from './types';

const DEFAULT_MODAL = {
  title: 'Need more workspaces?',
  header: 'New Workspace',
};

export const STARTER_PRO_LIMIT = {
  upgradeModal: () => ({
    ...getUpgradeModalProps(PlanType.TEAM, Tracking.UpgradePrompt.WORKSPACE_LIMIT),
    ...DEFAULT_MODAL,
    description: 'Upgrade to the teams plan to unlock multiple workspaces.',
  }),
} satisfies UpgradeModalEntitlementLimit;

export const TEAM_LIMIT = {
  upgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.WORKSPACE_LIMIT),
    description: `You've reached ${limit} workspaces limit allowed in your organization. Contact sales to unlock more.`,
  }),
} satisfies UpgradeModalEntitlementLimit;

export const WORKSPACES_LIMITS = {
  limit: LimitType.WORKSPACES,
  entitlement: 'workspacesLimit',
  limits: {
    [PlanType.STARTER]: STARTER_PRO_LIMIT,
    [PlanType.PRO]: STARTER_PRO_LIMIT,
    [PlanType.TEAM]: TEAM_LIMIT,
  },
} satisfies LimitV3;
