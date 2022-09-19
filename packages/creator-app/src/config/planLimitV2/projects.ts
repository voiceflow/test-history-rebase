import { PlanType } from '@voiceflow/internal';

import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';

import { PlanLimit, UpgradeModalDynamicLimit } from './types';
import { applyEnterpriseLimits, applyStarterLimits, applyTeamLimits, getUpgradeToModalProps } from './utils';

const DEFAULT_MODAL = {
  title: 'Need more projects?',
  header: 'New Project',
};

const STARTER_LIMIT: UpgradeModalDynamicLimit = {
  getUpgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    ...getUpgradeToModalProps(PlanType.TEAM, Tracking.UpgradePrompt.PROJECT_LIMIT),
    description: `You've reached your ${limit} free project limit. Upgrade to team for unlimited projects.`,
  }),
};

const TEAM_ENTERPRISE_LIMIT: UpgradeModalDynamicLimit = {
  getUpgradeModal: ({ limit }) => ({
    ...DEFAULT_MODAL,
    onUpgrade: (dispatch) => dispatch(Session.showIntercom),
    description: `You've reached your ${limit} project limit. Contact us to increase project limits.`,
    upgradePrompt: Tracking.UpgradePrompt.PROJECT_LIMIT,
    upgradeButtonText: 'Contact Us',
  }),
};

export const PROJECTS_LIMITS: PlanLimit<UpgradeModalDynamicLimit> = {
  ...applyTeamLimits(TEAM_ENTERPRISE_LIMIT),
  ...applyStarterLimits(STARTER_LIMIT),
  ...applyEnterpriseLimits(TEAM_ENTERPRISE_LIMIT),
};
