import { PlanType } from '@voiceflow/internal';

import { LimitType } from '@/constants/limits';
import * as Tracking from '@/ducks/tracking';
import { getUpgradeModalProps } from '@/utils/upgrade';

import { LimitV3, UpgradeModalEntitlementLimit } from './types';

const DEFAULT_MODAL = {
  title: 'Need more agents?',
  header: 'New Agent',
};

const STARTER_LIMIT = {
  upgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeModalProps(PlanType.PRO, Tracking.UpgradePrompt.PROJECT_LIMIT),
    description: `You've reached your ${limit} free agent limit. Upgrade to pro to increase agent limits.`,
  }),
} satisfies UpgradeModalEntitlementLimit;

const PRO_LIMIT = {
  upgradeModal: ({ limit, teamsPlanSelfServeIsEnabled }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeModalProps(PlanType.TEAM, Tracking.UpgradePrompt.PROJECT_LIMIT),
    description: `You've reached your ${limit} agent limit. ${
      teamsPlanSelfServeIsEnabled ? 'Upgrade to teams to increase agent limits.' : 'Contact us to increase agent limits.'
    }`,
  }),
} satisfies UpgradeModalEntitlementLimit;

const TEAMS_LIMIT = {
  upgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.PROJECT_LIMIT),
    description: `You've reached your ${limit} agent limit. Contact us to increase agent limits.`,
  }),
} satisfies UpgradeModalEntitlementLimit;

export const PROJECTS_LIMITS = {
  limit: LimitType.PROJECTS,
  entitlement: 'agentsLimit',
  limits: {
    [PlanType.STARTER]: STARTER_LIMIT,
    [PlanType.PRO]: PRO_LIMIT,
    [PlanType.TEAM]: TEAMS_LIMIT,
  },
} satisfies LimitV3;
