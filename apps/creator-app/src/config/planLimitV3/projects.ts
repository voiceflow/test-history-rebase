import { PlanType } from '@voiceflow/internal';

import { LimitType } from '@/constants/limits';
import * as Tracking from '@/ducks/tracking';
import { getUpgradeModalProps } from '@/utils/upgrade';

import { LimitV3, UpgradeModalEntitlementLimit } from './types';

const DEFAULT_MODAL = {
  title: 'Need more assistants?',
  header: 'New Assistant',
};

const STARTER_LIMIT = {
  upgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeModalProps(PlanType.PRO, Tracking.UpgradePrompt.PROJECT_LIMIT),
    description: `You've reached your ${limit} free assistant limit. Upgrade to pro to increase assistant limits.`,
  }),
} satisfies UpgradeModalEntitlementLimit;

const PRO_LIMIT = {
  upgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeModalProps(PlanType.TEAM, Tracking.UpgradePrompt.PROJECT_LIMIT),
    description: `You've reached your ${limit} assistant limit. Contact us to increase assistant limits.`,
  }),
} satisfies UpgradeModalEntitlementLimit;

export const PROJECTS_LIMITS = {
  limit: LimitType.PROJECTS,
  entitlement: 'agentsLimit',
  limits: {
    [PlanType.STARTER]: STARTER_LIMIT,
    [PlanType.PRO]: PRO_LIMIT,
  },
} satisfies LimitV3;
