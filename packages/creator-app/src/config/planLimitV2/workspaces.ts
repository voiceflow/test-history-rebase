import { PlanType } from '@voiceflow/internal';

import * as Tracking from '@/ducks/tracking';
import { getUpgradeToModalProps } from '@/utils/upgrade';

import { PlanLimit, UpgradeModalStaticLimit } from './types';
import { applyStarterLimits, applyTeamLimits } from './utils';

const STARTER_TEAM_LIMITS: UpgradeModalStaticLimit = {
  limit: 1,
  getUpgradeModal: () => {
    return {
      ...getUpgradeToModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.WORKSPACE_LIMIT),
      title: 'Need more workspaces?',
      header: 'New Workspace',
      description: 'Multiple workspaces is an Enterprise feature. Please contact sales to unlock.',
    };
  },
};

export const WORKSPACES_LIMITS: PlanLimit<UpgradeModalStaticLimit> = {
  ...applyTeamLimits(STARTER_TEAM_LIMITS),
  ...applyStarterLimits(STARTER_TEAM_LIMITS),
};
