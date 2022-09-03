import * as Tracking from '@/ducks/tracking';

import { PlanLimit, UpgradeModalLimit } from './types';
import { applyStarterLimits, applyTeamLimits, onOpenBookDemoPageWithTrackingFactory, onOpenPaymentModal } from './utils';

const DEFAULT_MODAL = {
  title: 'Need to design larger assistants?',
  header: 'Domains',
};

const TEAM_LIMIT: UpgradeModalLimit = {
  value: 3,
  upgradeModal: {
    ...DEFAULT_MODAL,
    onUpgrade: onOpenBookDemoPageWithTrackingFactory(Tracking.UpgradePrompt.DOMAINS),
    description: `Upgrade to enterprise to unlock unlimited domains for all assistants in your workspace.`,
    upgradeButtonText: 'Contact Sales',
  },
};

const STARTER_LIMIT: UpgradeModalLimit = {
  value: 1,
  upgradeModal: {
    ...DEFAULT_MODAL,
    onUpgrade: onOpenPaymentModal,
    description: `Upgrade to team to unlock ${TEAM_LIMIT.value} domains for all assistants in your workspace.`,
    upgradeButtonText: 'Upgrade to Team',
  },
};

export const DOMAINS_LIMITS: PlanLimit<UpgradeModalLimit> = {
  ...applyTeamLimits(TEAM_LIMIT),
  ...applyStarterLimits(STARTER_LIMIT),
};
