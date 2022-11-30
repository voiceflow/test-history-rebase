import { PlanType } from '@voiceflow/internal';

import * as Tracking from '@/ducks/tracking';
import { getUpgradeToModalProps } from '@/utils/upgrade';

import { PlanPermission, UpgradeModalPermission } from './types';
import { applyTeamPermissions } from './utils';

const TEAM_PERMISSION: UpgradeModalPermission = {
  getUpgradeModal: () => {
    return {
      ...getUpgradeToModalProps(PlanType.TEAM, Tracking.UpgradePrompt.IMPORT_NLU),
      title: 'Need to import NLU data?',
      header: 'NLU Import',
      description: `NLU import is a team feature. Please upgrade to team to continue. `,
    };
  },
};

export const BULK_UPLOAD_PERMISSIONS: PlanPermission<UpgradeModalPermission> = {
  ...applyTeamPermissions(TEAM_PERMISSION),
};
