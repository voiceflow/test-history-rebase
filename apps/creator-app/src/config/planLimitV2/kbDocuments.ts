import { PlanType } from '@voiceflow/internal';

import { LimitType } from '@/constants/limits';
import * as Tracking from '@/ducks/tracking';
import { getLegacyUpgradeModalProps } from '@/utils/upgrade';

import { PlanLimit, UpgradeModalStaticLimit } from './types';
import { applyEnterpriseLimits, applyPersonalLimits, applyProLimits, applyStarterLimits, applyTeamLimits } from './utils';

const DEFAULT_MODAL = {
  title: 'Need more knowledge base documents?',
  header: 'Add Documents',
};

const STARTER_PERSONAL_LIMIT = {
  limit: 50,

  upgradeModal: () => ({
    ...DEFAULT_MODAL,
    ...getLegacyUpgradeModalProps(PlanType.PRO, Tracking.UpgradePrompt.KB_DOCUMENTS),
    description: `Upgrade to the pro plan to unlock more documents.`,
  }),
} satisfies UpgradeModalStaticLimit;

const PRO_TEAM_LIMIT = {
  limit: 200,
  upgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getLegacyUpgradeModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.KB_DOCUMENTS),
    description: `You've reached the ${limit} documents limit allowed in your workspace. Contact sales to unlock more.`,
  }),
} satisfies UpgradeModalStaticLimit;

const ENTERPRISE_LIMIT = {
  limit: 5000,
  upgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getLegacyUpgradeModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.KB_DOCUMENTS),
    description: `You've reached the ${limit} documents limit allowed in your workspace. Contact sales to unlock more.`,
  }),
} satisfies UpgradeModalStaticLimit;

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
