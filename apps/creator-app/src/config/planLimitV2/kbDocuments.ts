import { PlanType } from '@voiceflow/internal';

import { LimitType } from '@/constants/limits';
import * as Tracking from '@/ducks/tracking';
import { getUpgradeModalProps } from '@/utils/upgrade';

import { PlanLimit, UpgradeModalDynamicLimit } from './types';
import { applyEnterpriseLimits, applyPersonalLimits, applyProLimits, applyStarterLimits, applyTeamLimits } from './utils';

const DEFAULT_MODAL = {
  title: 'Need more knowledge base documents?',
  header: 'Add Documents',
};

const STARTER_PERSONAL_LIMIT = {
  upgradeModal: () => ({
    ...DEFAULT_MODAL,
    ...getUpgradeModalProps(PlanType.PRO, Tracking.UpgradePrompt.KB_DOCUMENTS),
    description: `Upgrade to the pro plan to unlock more documents.`,
  }),
} satisfies UpgradeModalDynamicLimit;

const PRO_TEAM_LIMIT = {
  upgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.KB_DOCUMENTS),
    description: `You've reached the ${limit} documents limit allowed in your workspace. Contact sales to unlock more.`,
  }),
} satisfies UpgradeModalDynamicLimit;

const ENTERPRISE_LIMIT = {
  upgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.KB_DOCUMENTS),
    description: `You've reached the ${limit} documents limit allowed in your workspace. Contact sales to unlock more.`,
  }),
} satisfies UpgradeModalDynamicLimit;

export const KB_DOCUMENTS_LIMITS = {
  limit: LimitType.KB_DOCUMENTS,
  limits: {
    ...applyStarterLimits(STARTER_PERSONAL_LIMIT),
    ...applyPersonalLimits(STARTER_PERSONAL_LIMIT),
    ...applyProLimits(PRO_TEAM_LIMIT),
    ...applyTeamLimits(PRO_TEAM_LIMIT),
    ...applyEnterpriseLimits(ENTERPRISE_LIMIT),
  },
} satisfies PlanLimit;