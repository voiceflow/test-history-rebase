import { PlanType } from '@voiceflow/internal';

import * as Tracking from '@/ducks/tracking';

import { PlanLimit, UpgradeModalValueLimit } from './types';
import { applyStarterLimits, getUpgradeToModalProps } from './utils';

const STARTER_LIMIT: UpgradeModalValueLimit = {
  value: 0,
  getUpgradeModal: () => ({
    header: 'NLU Import',
    title: 'Need to import NLU data?',
    description: `NLU import is a team feature. Please upgrade to team to continue. `,
    ...getUpgradeToModalProps(PlanType.TEAM, Tracking.UpgradePrompt.IMPORT_NLU),
  }),
};

export const NLU_IMPORT_LIMITS: PlanLimit<UpgradeModalValueLimit> = {
  ...applyStarterLimits(STARTER_LIMIT),
};
