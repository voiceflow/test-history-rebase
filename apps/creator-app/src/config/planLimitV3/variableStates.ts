import { PlanType } from '@voiceflow/internal';

import { LimitType } from '@/constants/limits';
import * as Tracking from '@/ducks/tracking';
import { getUpgradeModalProps } from '@/utils/upgrade';

import type { LimitV3, UpgradeModalEntitlementLimit } from './types';

const DEFAULT_MODAL = {
  title: 'Need more personas?',
  header: 'Personas',
};

// FIXME: refactor - get plan limits from backend (VF-3328)
const TEAM_LIMIT_VALUE = 3;

const STARTER = {
  upgradeModal: () => ({
    ...DEFAULT_MODAL,
    ...getUpgradeModalProps(PlanType.PRO, Tracking.UpgradePrompt.VARIABLE_STATES_LIMIT),
    description: `You’ve used your free persona. Upgrade to pro to unlock up to ${TEAM_LIMIT_VALUE} personas.`,
  }),
} satisfies UpgradeModalEntitlementLimit;

const PRO_TEAM = {
  upgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.VARIABLE_STATES_LIMIT),
    description: `You’ve used ${limit}/${limit} personas. Contact sales to unlock unlimited personas.`,
  }),
} satisfies UpgradeModalEntitlementLimit;

export const VARIABLE_STATES_LIMITS = {
  limit: LimitType.VARIABLE_STATES,
  entitlement: 'personasLimit',
  limits: {
    [PlanType.STARTER]: STARTER,
    [PlanType.TEAM]: PRO_TEAM,
    [PlanType.PRO]: PRO_TEAM,
  },
} satisfies LimitV3;
