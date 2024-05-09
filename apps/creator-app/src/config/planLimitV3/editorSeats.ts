import { PlanType } from '@voiceflow/internal';

import { LimitType } from '@/constants/limits';
import * as Tracking from '@/ducks/tracking';
import { getUpgradeModalProps } from '@/utils/upgrade';

import { LimitV3, UpgradeModalEntitlementLimit } from './types';

const DEFAULT_MODAL = {
  title: 'Need more Editor seats?',
  header: 'Add Members',
};

const STARTER_PRO_LIMIT: UpgradeModalEntitlementLimit = {
  upgradeModal: () => ({
    ...DEFAULT_MODAL,
    ...getUpgradeModalProps(PlanType.TEAM, Tracking.UpgradePrompt.EDITOR_SEATS),
    description: `Upgrade to the teams plan to unlock more editor seats.`,
  }),
};

const TEAM_LIMIT = {
  upgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.EDITOR_SEATS),
    description: `You've reached ${limit} editor seats limit allowed in your organization. Contact sales to unlock more.`,
  }),
} satisfies UpgradeModalEntitlementLimit;

const ENTERPRISE_LIMIT = {
  upgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.EDITOR_SEATS),
    header: 'Add Members',
    description: `You've reached ${limit} editor seats limit allowed in your organization. Contact sales to unlock more.`,
  }),
} satisfies UpgradeModalEntitlementLimit;

export const EDITOR_SEATS_LIMITS = {
  limit: LimitType.EDITOR_SEATS,
  entitlement: 'editorSeatsLimit',
  limits: {
    [PlanType.STARTER]: STARTER_PRO_LIMIT,
    [PlanType.PRO]: STARTER_PRO_LIMIT,
    [PlanType.TEAM]: TEAM_LIMIT,
    [PlanType.ENTERPRISE]: ENTERPRISE_LIMIT,
  },
} satisfies LimitV3;
